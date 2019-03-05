<template>
    <div class="container" ref="rhythmShare">


        <audio ref="do" @ended="audioend('do')">
            <source src="../assets/musics/rhythm-select-do.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="re" @ended="audioend('re')">
            <source src="../assets/musics/rhythm-select-re.mp3" type="audio/mpeg"/>
        </audio>

        <audio ref="mi" @ended="audioend('mi')">
            <source src="../assets/musics/rhythm-select-mi.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="fa" @ended="audioend('fa')">
            <source src="../assets/musics/rhythm-select-fa.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="sol" @ended="audioend('sol')">
            <source src="../assets/musics/rhythm-select-sol.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="la" @ended="audioend('la')">
            <source src="../assets/musics/rhythm-select-la.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="xi" @ended="audioend('xi')">
            <source src="../assets/musics/rhythm-select-xi.mp3" type="audio/mpeg"/>
        </audio>

        <canvas id="canvas" class="canvas" ref="canvas" v-if="isSaveImage" ></canvas>

        <div v-else style="width: 100%;height: 100%">
            <avatar class="avatar"/>
            <img :src="bg" class="img"/>
            <move-arrow class="arrow"/>

            <img :src="textIcon1"
                 ref="icon1"
                 v-if="showIcon1"
                 :class="[`text${rand}-icon1`]"/>
            <img :src="textIcon2"
                 v-if="showIcon2"
                 ref="icon2"
                 :class="[`text${rand}-icon2`]"/>

            <img :src="textIcon1"
                 v-if="showIcon1"
                 ref="icon3"
                 :class="[`text${rand}-icon3`]"/>
            <img :src="textIcon2"
                 v-if="showIcon2"
                 ref="icon4"
                 :class="[`text${rand}-icon4`]"/>
            <!--<share-music-playing-bar class="share-music-playing-bar" v-if="isPlaying"/>-->


            <img :src="`${baseUrl}pause-btn.png`"
                 @click="handlePlay"
                 class="pause-btn btm img-btn" v-if="isPlaying"/>
            <img :src="`${baseUrl}play-btn.png`"
                 @click="handlePlay"
                 class="pause-btn btm  img-btn" v-else/>
            <img :src="`${baseUrl}download-btn.png`"
                 @click="handleDownloadImage"
                 class="download-btn btm  img-btn"/>
            <img :src="`${baseUrl}try-play-btn.png`"
                 @click="handleGoToHome"
                 class="try-play-btn btm"/>
            <img :src="`${baseUrl}qr-code.png`" class="qr-code btm"/>
        </div>

        <div id="preview" class="preview"
             @click="handlePreview" v-if="showPreview">

        </div>



    </div>
</template>

<script>

    import {showMsg, getRandomInt} from "../utils/common";
    import {mapGetters, mapMutations} from 'vuex'
    import {CHANGE_LOADING_BAR} from "../store/mutations";
    import ShareMusicPlayingBar from "../components/ShareMusicPlayingBar";
    import {getSignInfo , uploadRecord} from "../utils/http";
    import {
        wx_config,
        wx_playRecord,
        wx_stopPlayRecord,
        wx_timelineShare,
        wx_appMessageShare,
        wx_registerOnVoicePlayEnd,
        onMenuShareAppMessage,
        onMenuShareQQ,
        onMenuShareQZone,
        onMenuShareTimeline
    } from "../utils/wx-config";
    import MoveArrow from "../components/MoveArrow";
    import Avatar from "../components/avatar";

    const page = 'rhythm-share-'
    export default {
        name: "rhythm-share",
        components: {Avatar, MoveArrow, ShareMusicPlayingBar},
        computed: {
            ...mapGetters(['base' , 'headimgurl' , 'nickname' , 'openid' , 'timeline']),
            baseUrl() {
                console.log('url', `${this.base}${page}`)
                return `${this.base}${page}`
            },
            // bg(){
            //     return `${this.base}${page}bg.png`
            // },
            playingIcon() {
                return `${this.base}${page}playing.png`
            },
            playIcon() {
                return `${this.base}${page}play.png`
            },
            textIcon1() {
                return `${this.base}${page}text${this.rand}-icon1.png`
            },
            textIcon2() {
                if (this.rand == 5) {
                    return `${this.base}${page}text${this.rand}-icon1.png`
                }
                return `${this.base}${page}text${this.rand}-icon2.png`
            },
            showIcon1() {
                return this.rand != 3
            },
            showIcon2() {

                return this.rand == 4 || this.rand == 5 || this.rand == 6
            }
        },
        data() {
            return {
                url: this.base,
                isPlaying: false,
                shareBg: '',
                bg: '',
                rand: 1,
                isFromShare: false,
                recordId:'',
                imgStr:'',
                isSaveImage:false,
                showPreview:false,
                recordurl:'',


            }
        },
        mounted(option) {

            let {recordurl , rand , recordId } = this.$route.query

            console.log('recordurl , rand , recordId' , recordurl , rand , recordId)
            //是否从分享页面进来

            rand = rand ? rand : getRandomInt(1, 6)
            this.rand = rand
            this.bg = `${this.base}${page}bg${rand}.png`
            this.shareBg = `${this.base}${page}bg${rand}.png`

            this.recordId = recordId
            this.recordurl = recordurl
            this.init()
        },
        methods: {
            handlePreview(){
                console.log('handlePreview')
                this.showPreview = false
            },
            downLoadImage(){
                console.log('downLoadImage')
                loadImage(this.headimgurl , img =>  {
                    console.log('downLoadImage img' , img)
                    this.imgStr = img
                })
            },
            ...mapMutations([CHANGE_LOADING_BAR, 'setLoadingText']),
            async init() {
                try {
                    this.CHANGE_LOADING_BAR(true)
                    this.setLoadingText('设置分享...')
                    let shareId = ''
                    if (this.recordurl) {
                        //从分享也进来，从服务器拿分享的录音视频链接
                        shareId = this.recordurl
                        // this.recordId = ''
                        console.log('从分享也进来' , this.recordurl , this.rand , this.$route.query)
                    }else{
                        // shareId =  await uploadRecord(this.openid , this.recordId)
                        shareId =  'testshareid'
                        console.log('上传录音' , this.openid , this.recordId , 'share url' , shareId)
                    }


                    console.log('this.$route', this.$route)
                    let link = window.location.href.split('?')[0]
                    // let link = window.location.href.split('#')[0]
                    // link = link.replace(/[/]$/, '')

                    //分享link强制?#模式，否则android会截断?后的query
                    link  = link.replace('#' , '?#')
                    link = `${link}?recordurl=${shareId}&rand=${this.rand}`

                    const {
                        appid,
                        noncestr,
                        signature,
                        timestamp
                    } = await getSignInfo(link)

                    console.log('noncestr' ,   appid,
                        noncestr,
                        signature,
                        timestamp)
                    const title = '测试分享数据'
                    const desc = '测试分享数据desc'

                    console.log('share link', link)
                    const imgUrl = this.shareBg
                    // const imgUrl = `${this.base}rank-list-search.png`
                    const jsApiList = [
                        'updateAppMessageShareData',
                        'updateTimelineShareData',
                        //下面这两个api，虽然已经废弃，但是android必须调用，否则不能分享
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        // 'onMenuShareQQ',
                        // 'onMenuShareQZone',
                    ]
                    console.log('分享数据title, desc, link, imgUrl' , title, desc, link, imgUrl)
                    await wx_config(appid, timestamp, noncestr, signature, jsApiList , imgUrl)
                    console.log('分享结束1')
                    await wx_appMessageShare(title, desc, link, imgUrl)
                    console.log('分享结束2')
                    await wx_timelineShare(title, link, imgUrl)
                    console.log('分享结束3')
                     onMenuShareTimeline(title, link, imgUrl)
                    console.log('分享结束4')
                     onMenuShareAppMessage(title, desc, link, imgUrl)
                    // await onMenuShareQQ(title, desc, link, imgUrl)
                    // await onMenuShareQZone(title, desc, link, imgUrl)

                    console.log('分享结束5')
                } catch (e) {
                    console.log('error ', e)
                } finally {
                    this.CHANGE_LOADING_BAR(false)
                }
            },
            audioend(item) {
                this.curAudio = null
                this.isPlayingAudio = false
            },
            getTime() {
                const d = new Date()
                const t = d.getTime();
                // console.log('time' , t)
                return t
            },
            stopPlayRecord() {
                this.isPlaying = false
                clearInterval(this.playRecordTime)
            },
            async playMusic(key) {
                this.isPressMusicBtn = true
                this.stopaudio()

                const audio = this.$refs[key]
                if (audio) {
                    this.curAudio = audio
                    this.isPlayingAudio = true
                    console.log('music playing')
                    audio.play().catch(err=>{
                        console.log('audio play error' , err)
                    })
                } else {
                    console.error('music doesnot exist')
                }
            },
            startPlayRecord() {
                this.isPlaying = true
                this.startTime = this.getTime()
                this.cloneTimeline = [...this.timeline]
                let endTime = this.cloneTimeline.pop()
                this.playRecordTime = setInterval(() => {
                    const offTime = this.getTime() - this.startTime

                    if(offTime + 90 > endTime.time){
                        //end
                        this.isPlaying = false
                    }
                    if (this.cloneTimeline.length > 0) {
                        const cur = this.cloneTimeline[0]
                        console.log('offTime', offTime, cur)
                        if (cur.time > offTime - 50 && cur.time < offTime + 50) {
                            this.playMusic(cur.key)
                            this.cloneTimeline.shift()
                            console.log('get key', cur.key)
                        }
                    }
                }, 90)
            },
            stopaudio() {
                if (this.isPlayingAudio && this.curAudio) {
                    this.curAudio.pause();
                    this.curAudio.currentTime = 0;
                    this.isPlayingAudio = false
                    this.curAudio = null
                }

            },
            handlePlay(e) {
                console.log('handlePlay')
                if (this.isPlaying) {
                    console.log('this.tempFilePath stopPlayRecord')
                    this.stopPlayRecord()
                    // wx_stopPlayRecord(this.tempFilePath)
                } else {
                    this.stopaudio()
                    this.startPlayRecord()
                    console.log('this.tempFilePath startPlayRecord')
                }
            },

            async getImage(url){
                return new Promise((res , rej)=>{
                    if(url.indexOf('qlogo') !== -1){
                        console.log('下载微信头像')
                        loadImage(url , img=>{
                            if(img.type === 'error'){
                                console.log('error img loadImage' , url)
                                rej('error img')
                            }else{
                                res(img)
                            }
                        } , {
                        })
                    }else{
                        loadImage(url , img=>{
                            if(img.type === 'error'){
                                console.log('error img loadImage' , url)
                                rej('error img')
                            }else{
                                res(img)
                            }
                        } , {
                            crossOrigin:"Anonymous"
                        })
                    }

                })




            },
             handleDownloadImage() {
                console.log('screenShot')
                try {
                    this.isSaveImage = true
                    this.$nextTick(()=>{
                        this.screenShot()
                    })

                }catch (e) {
                    console.log('screenShot' , e)
                }finally {
                    // this.isSaveImage = false
                }

            },
            async screenShot(){

                function rem(p) {
                    const pxTorem = window.innerWidth/10
                    const px = 37.5
                    return pxTorem * p / px
                }
                try {
                  
                    const canvas = document.getElementById('canvas')
                    console.log('toDataURL',canvas)
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    console.log(window.innerWidth , window.innerHeight)
                    const ctx = canvas.getContext('2d')
                    const bg = await this.getImage(this.shareBg)

                    ctx.drawImage(bg , 0 , 0 , window.innerWidth , window.innerHeight)



                    ctx.save()
                    ctx.beginPath();
                    ctx.arc(rem(43) + rem(25)/2,
                        rem(30) + rem(25)/2,
                        rem(25)/2, 0,
                        Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    const head = await this.getImage(this.headimgurl)

                    ctx.drawImage(head ,
                        rem(43),
                        rem(30) ,
                        rem(25) ,
                        rem(25))

                    ctx.restore();

                    ctx.save()
                    ctx.fillStyle = 'white'
                    ctx.textBaseline = 'middle'
                    ctx.font = `${rem(18)}px -apple-system-font, Helvetica Neue, sans-serif`;
                    ctx.fillText(this.nickname , rem(72) , rem(45))
                    ctx.restore();

                    let qr = `${this.baseUrl}qr-code.png`
                    qr = await this.getImage(qr)

                    const top = 556/667 * window.innerHeight
                    ctx.drawImage(qr ,
                        rem(278),
                        top ,
                        rem(62) ,
                        rem(62))

                    const res = canvas.toDataURL('image/png')
                    this.isSaveImage = false
                    this.showPreview = true
                    this.$nextTick(()=>{
                        console.log('preview')
                        const img = new Image()
                        img.src = canvas.toDataURL('image/png')

                        // img.width = window.innerWidth
                        // img.height = window.innerHeight
                        img.style.height = '100%';
                        img.style.width = '100%';
                        const preview = document.getElementById('preview')
                        preview.append(img)
                    })





                }catch (e) {
                    console.error(e)
                }finally {
                    this.isSaveImage = false
                }

            },
            handleGoToHome() {
                // if(!this.isFromShare){
                //     this.$router.back()
                // }
                this.$router.replace({name:'home'})
            }
        },
        beforeRouteEnter(to, from, next) {
            next()
        },
        beforeRouteUpdate(to, from, next) {
            next()
        },
        async beforeRouteLeave(to, from, next) {

            try {

                clearInterval(this.playRecordTime)
                this.playRecordTime = null

            }catch (e) {
                console.error('beforeRouteLeave' , e)
            }finally {
                next()
            }


        }
    }
</script>

<style scoped lang="scss">

    .preview{
        position: absolute;
        width: 100%;
        height: 100%;
        left:0;
        right: 0;
        top:0;
        bottom: 0;
        z-index: 100;
    }
    .avatar{
        position: absolute;
        top:30*2px;
        left: 43*2px;
    }

    .canvas{
        display: none;
    }

    .container {
        height: 100%;
        width: 100%;
        position: relative;
        margin: 0;
        padding: 0;

        /*>div{*/
            /*height: 100%;*/
            /*width: 100%;*/
        /*}*/
    }


    .img {
        height: 100%;
        width: 100%;
    }


    .btn-middle {
        position: absolute;
        height: 8.25%;
        width: 322px;
    }


    .btn-share {
        top: 75.56%;
        left: 214px;
        background-color: transparent;
        margin: 0;
        padding: 0;
        outline: 0;
    }

    .btn-register {
        top: 83.51%;
        left: 214px;
        border: 1px solid skyblue;
    }

    .share-music-playing-bar {
        position: absolute;
        left: 670px;
        top: 21.29%;
    }


    .btm {
        position: absolute;
        bottom: 6.6%;
        z-index: 100;
    }

    .img-btn {

        width: 36*2px;
        height: 36*2px;
        border-radius: 36*2px;
        overflow: hidden;
    }

    .pause-btn {
        left: 36*2px;
    }

    .download-btn {
        left: 82*2px;
    }

    .try-play-btn {
        left: 127*2px;

        width: 95*2px;
        height: 36*2px;
        border-radius: 95*2px;
        overflow: hidden;
    }

    .qr-code {
        right: 33*2px;
        width: 62*2px;
        height: 62*2px;
    }

    .arrow {

        top: 16px;
        right: 16px;

    }

    $speed: 3s;
    $speed6: $speed * 2;
    $speed4: 12s;
    $delay4: 0s;
    $speed3:3s;
    .text1-icon1 {
        position: absolute;
        z-index: 100;
        top: 16.64%;
        height: 15.74%;
        width: 256*2px;
        left: 40*2px;
    }

    .text2-icon1 {
        position: absolute;
        z-index: 100;
        top: 34.78%;
        height: 23*2px;
        width: 23*2px;
        left: 40*2px;
        animation: text2-icon1 $speed3 linear 0s infinite;
    }

    @keyframes text2-icon1 {
        0% {

        }
        100% {
            transform: rotate(360deg);
        }
    }

    .text4-icon1 {
        position: absolute;
        z-index: 100;
        top: 80.51%;
        height: 25*2px;
        width: 25*2px;
        right: 190*2px;
        animation: text4-icon1 $speed4 linear 0s infinite;
    }

    @keyframes text4-icon1 {
        0% {
            right: 190*2px;
        }
        22.5% {
            right: 315*2px;
        }
        90%{
            opacity: 1;
            right: 315*2px;
        }
        100% {
            opacity: 0;
            right: 315*2px;
        }
    }

    .text4-icon2 {
        position: absolute;
        z-index: 100;
        top: 80.51%;
        height: 25*2px;
        width: 25*2px;
        right: 160*2px;
        animation: text4-icon2 $speed4 linear 0s infinite;
    }

    @keyframes text4-icon2 {
        0% {
            right: 160*2px;
        }
        22.5% {
            right: 160*2px;
        }
        45% {
            right: 285*2px;
        }
        90%{
            opacity: 1;
            right: 285*2px;
        }

        100% {
            opacity: 0;
            right: 285*2px;
        }
    }

    .text4-icon3 {
        position: absolute;
        z-index: 100;
        top: 80.51%;
        height: 25*2px;
        width: 25*2px;
        right: 130*2px;
        animation: text4-icon3 $speed4 linear infinite;

    }

    @keyframes text4-icon3 {
        0% {
            right: 130*2px;
        }
        45% {
            right: 130*2px;
        }
        67.5% {
            right: 255*2px;
        }
        90%{
            opacity: 1;
            right: 255*2px;
        }

        100% {
            opacity: 0;
            right: 255*2px;
        }

    }

    .text4-icon4 {
        position: absolute;
        z-index: 100;
        top: 80.51%;
        height: 25*2px;
        width: 25*2px;
        right: 100*2px;
        animation: text4-icon4 $speed4 linear infinite;
    }

    @keyframes text4-icon4 {

        0% {
            right: 100*2px;
        }
        67.5% {
            right: 100*2px;
        }
        90%{
            opacity: 1;
            right: 225*2px;
        }

        100% {
            opacity: 0;
            right: 225*2px;
        }
    }

    $speed5: 9s;
    .text5-icon1 {
        position: absolute;
        z-index: 100;
        top: 72.51%;
        height: 1.95%;
        width: 93*2px;
        left: 40*2px;
        animation: text5-icon1 $speed5 linear infinite;
    }

    @keyframes text5-icon1 {
        0% {
            opacity: 0;
        }
        30% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .text5-icon2 {
        position: absolute;
        z-index: 100;
        top: 75.56%;
        height: 2.55%;
        width: 122*2px;
        left: 40*2px;
        animation: text5-icon2 $speed5 linear infinite;
    }

    @keyframes text5-icon2 {
        0% {
            opacity: 0;
        }
        30% {
            opacity: 0;
        }
        60% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .text5-icon3 {
        position: absolute;
        z-index: 100;
        top: 79.91%;
        height: 3.45%;
        width: 162*2px;
        left: 40*2px;
        animation: text5-icon3 $speed5 linear infinite;
    }

    @keyframes text5-icon3 {
        0% {
            opacity: 0;
        }
        60% {
            opacity: 0;
        }
        90% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .text6-icon1 {
        position: absolute;
        z-index: 100;
        top: 30.88%;
        height: 13.34%;
        width: 148*2px;
        left: 0;
        animation: text6-icon1 $speed6 linear infinite;
    }

    @keyframes text6-icon1 {
        from {
            left: 0;
            transform: translateX(-200%);
        }
        to {
            left: 100%;
        }
    }

    .text6-icon2 {
        position: absolute;
        z-index: 100;
        top: 50.97%;
        height: 13.34%;
        width: 153*2px;
        right: 0;
        animation: text6-icon2 $speed6 linear infinite;
    }

    @keyframes text6-icon2 {
        from {
            right: 0;
            transform: translateX(200%);
        }
        to {
            right: 100%;
        }
    }
</style>
