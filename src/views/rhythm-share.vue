<template>
    <div class="container" ref="rhythmShare">
        <canvas id="canvas" class="canvas" ref="canvas" v-if="isSaveImage" ></canvas>

        <div v-else style="width: 100%;height: 100%">
            <audio ref="shareRecord" @ended="audioend">
                <source :src="recordurl" type="audio/mpeg"/>
            </audio>
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
        wx_registerOnVoicePlayEnd
    } from "../utils/wx-config";
    import MoveArrow from "../components/MoveArrow";
    import Avatar from "../components/avatar";

    const page = 'rhythm-share-'
    export default {
        name: "rhythm-share",
        components: {Avatar, MoveArrow, ShareMusicPlayingBar},
        computed: {
            ...mapGetters(['base' , 'headimgurl' , 'nickname' , 'openid']),
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
                recordurl:''
            }
        },
        mounted(option) {

            // this.downLoadImage()
            // const rhythmShare = this.$refs.canvas
            // if(rhythmShare){
            //     console.log('long press rhythmShare')
            //     rhythmShare.addEventListener('long-press', this.longPress)
            // }
            // const rand = 4
            let {recordurl , rand , recordId } = this.$route.query

            console.log('recordurl , rand , recordId' , recordurl , rand , recordId)
            console.log('mounted' , recordurl , rand , recordId)
            rand = rand ? rand : getRandomInt(1, 6)
            //是否从分享页面进来
            const isFromShare = !!recordurl
            const bg = `${this.base}${page}bg${rand}.png`
            const shareBg = `${this.base}${page}bg${rand}.png`

            console.log('shareBg' , shareBg)
            this.bg = bg
            this.shareBg = shareBg
            this.rand = rand
            this.isFromShare = isFromShare
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
            longPress(e){
                e.preventDefault()
                console.log('longPress' , e.target)
                this.screenShot()
            },
            ...mapMutations([CHANGE_LOADING_BAR, 'setLoadingText']),
            async init() {
                try {
                    // this.CHANGE_LOADING_BAR(true)
                    this.setLoadingText('设置分享...')
                    let shareId = ''
                    if (this.isFromShare) {
                        //从分享也进来，从服务器拿分享的录音视频链接
                        shareId = this.recordurl
                        // this.recordId = ''
                        console.log('从分享也进来，从服务器拿分享的录音视频链接')
                    }else{
                        shareId =  await uploadRecord(this.openid , this.recordId)
                        console.log('上传录音' , this.openid , this.recordId , 'share url' , shareId)
                    }





                    wx_registerOnVoicePlayEnd(() => {
                        console.log('语音播放完毕')
                        this.isPlaying = false
                    })

                    console.log('this.$route', this.$route)
                    const {
                        appid,
                        noncestr,
                        signature,
                        timestamp
                    } = await getSignInfo(window.location.href)

                    const title = '我的音乐人格'
                    const desc = '我的音乐人格分享'
                    let link = window.location.href.split('?')[0]
                    link = link.replace(/[/]$/, '')
                    link = `${link}?recordurl=${shareId}&rand=${this.rand}`
                    console.log('share link', link)
                    const imgUrl = this.shareBg
                    const jsApiList = [
                        'updateTimelineShareData',
                        'updateAppMessageShareData',
                    ]
                    await wx_config(appid, timestamp, noncestr, signature, jsApiList)
                    await wx_timelineShare(title, link, imgUrl)
                    await wx_appMessageShare(title, desc, link, imgUrl)

                } catch (e) {
                    console.log('error ', e)
                } finally {
                    this.CHANGE_LOADING_BAR(false)
                }
            },
            handlePlay(e) {
                console.log('handlePlay')
                if (this.isPlaying) {
                    wx_stopPlayRecord(this.recordId)
                    this.isPlaying = false
                } else {
                    wx_playRecord(this.recordId)
                    this.isPlaying = true
                }
            },
            handleRegister(e) {
                this.handlePlay()
                // console.log('handleRegister')
                // wx.navigateTo({
                //     url: '/pages/register/index'
                // })
            },

            async getImage(url){
                return new Promise((res , rej)=>{
                    // const image = new Image();
                    //
                    // image.onload = () => {
                    //     image.setAttribute("crossOrigin",'*')
                    //     res(image)
                    //
                    // };
                    // image.src = url
                    // image.setAttribute("crossOrigin",'Anonymous')



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
                })


                // return new Promise((res , rej)=>{
                //     const image = new Image();
                //
                //     image.onload = () => {
                //         image.setAttribute("crossOrigin",'*')
                //         res(image)
                //
                //     };
                //     image.src = url
                //     image.setAttribute("crossOrigin",'Anonymous')
                // })





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



                    // ctx.save()
                    // ctx.beginPath();
                    // ctx.arc(rem(43) + rem(25)/2,
                    //     rem(30) + rem(25)/2,
                    //     rem(25)/2, 0,
                    //     Math.PI * 2, true);
                    // ctx.closePath();
                    // ctx.clip();
                    // const head = await this.getImage(this.headimgurl)
                    //
                    // ctx.drawImage(head ,
                    //     rem(43),
                    //     rem(30) ,
                    //     rem(25) ,
                    //     rem(25))
                    //
                    // ctx.restore();

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
            },
            onShareAppMessage(obj) {
                console.log('onShareAppMessage', obj)

                // showMsg(this.data.rand.toString())
                return {
                    title: '我的音乐人格',
                    path: `/pages/rhythm-share/index?rand=${this.data.rand}`,
                    imageUrl: `${this.data.url}${this.data.shareBg}`
                }
            },

            clearResource() {
                if (this.ctx) {
                    this.ctx.stop()
                    this.ctx.destroy()
                    this.ctx = null
                }
            },
            onHide() {
                if (this.ctx) {
                    this.data.isPlaying && this.ctx.stop()
                }
            },
            onUnload() {
                this.clearResource()
            },
            initPlay() {
                this.ctx = wx.createInnerAudioContext()
                this.ctx.onPlay(() => {
                    console.log('开始播放')
                })
                this.ctx.onEnded(() => {
                    console.log('播放结束')
                    this.setData({
                        isPlaying: false
                    })
                })
                this.ctx.onError((res) => {
                    console.log('error', res)
                    this.setData({
                        isPlaying: false
                    })
                })
            },
            play() {
                this.ctx.src = this.tempFilePath
                this.ctx.play()
                this.setData({
                    isPlaying: true
                })
            },
            stop() {
                this.ctx.stop()
                this.setData({
                    isPlaying: false
                })
            },
            showModal(msg, title = '') {
                wx.showModal({
                    title: title.length === 0 ? '提示' : title,
                    content: msg,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
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
