<template>
    <div class="container" ref="rhythmShare" :class="{'con6':rand==6}">

        <canvas id="canvas" class="canvas" ref="canvas" v-show="isSaveImage" ></canvas>

        <div style="width: 100%;height: 100%">
            <avatar class="avatar"/>
            <img :src="bg" class="img"
                 :class="{'img6':rand==6}">/>
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
                 v-if="showIcon1 && rand != 6 && rand != 1 "
                 ref="icon3"
                 :class="[`text${rand}-icon3`]"/>
            <img :src="textIcon2"
                 v-if="showIcon2 && rand != 6 && rand != 1"
                 ref="icon4"
                 :class="[`text${rand}-icon4`]"/>
            <!--<share-music-playing-bar class="share-music-playing-bar" v-if="isPlaying"/>-->

            <icon3 class="icon3-com" v-if="rand == 3"/>

            <img :src="`${baseUrl}pause-btn.png`"
                 @click="handlePlay"
                 :class="{'btm6':rand == 6 }"
                 class="pause-btn btm img-btn" v-if="isPlaying"/>
            <img :src="`${baseUrl}play-btn.png`"
                 @click="handlePlay"
                 :class="{'btm6':rand == 6 }"
                 class="pause-btn btm  img-btn" v-else/>
            <img :src="`${baseUrl}download-btn.png`"
                 @click="handleDownloadImage"
                 :class="{'btm6':rand == 6 }"
                 class="download-btn btm  img-btn"/>
            <img :src="`${baseUrl}try-play-btn.png`"
                 v-if="isFromShare"
                 :class="{'btm6':rand == 6 }"
                 @click="handleGoToHome"
                 class="try-play-btn btm"/>
            <img :src="`${baseUrl}qr-code.png`"
                 :class="{'btm6':rand == 6 }"
                 class="qr-code btm"/>
        </div>

        <div id="preview" class="preview"
             @click="handlePreview" v-show="showPreview">

        </div>



    </div>
</template>

<script>

    import {showMsg, getRandomInt , isWeiXin} from "../utils/common";
    import {mapGetters, mapMutations} from 'vuex'
    import {CHANGE_LOADING_BAR} from "../store/mutations";
    import ShareMusicPlayingBar from "../components/ShareMusicPlayingBar";
    import {getSignInfo , uploadRecord , getAvater} from "../utils/http";
    import {initShare} from "../utils/wx-config";
    import MoveArrow from "../components/MoveArrow";
    import Avatar from "../components/avatar";
    import Icon3 from "../components/Icon3";

    const page = 'rhythm-share-'
    export default {
        name: "rhythm-share",
        components: {Icon3, Avatar, MoveArrow, ShareMusicPlayingBar},
        computed: {
            ...mapGetters(['base' , 'headimgurl' , 'nickname' , 'openid' , 'timeline']),
            baseUrl() {
                console.log('url', `${this.base}${page}`)
                return `${this.base}${page}`
            },
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

                return this.rand == 1 || this.rand == 4 || this.rand == 5 || this.rand == 6
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
            const that = this
            if(isWeiXin()){
                document.addEventListener("WeixinJSBridgeReady", function (e) {
                    console.log('WeixinJSBridgeReady init')
                    that.$sound.load()
                }, false);
            }else{
                that.$sound.load()
            }


            this.init()
        },
        methods: {
            async getWeChatUserHeadImg (picurl) {

                return new Promise((res , rej)=>{
                    try {
                        let img = new Image()
                        let canvas = document.createElement('CANVAS')
                        let ctx = canvas.getContext('2d')
                        img.crossOrigin = 'Anonymous'
                        img.onload = function () {
                            console.log('getWeChatUserHeadImg')
                            canvas.height = img.height
                            canvas.width = img.width
                            ctx.drawImage(img, 0, 0)
                            var dataURL = canvas.toDataURL('image/png')
                            console.log('dataURL' , dataURL)
                            canvas = null

                            const resImg = new Image()
                            resImg.src= dataURL

                            res(resImg)
                        }
                        img.src = picurl
                    }catch (e) {
                        rej(e)
                    }

                })

            },
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
            ...mapMutations([CHANGE_LOADING_BAR, 'setLoadingText' , 'settimeline' , 'setheadimgurl','setnickname']),
            async init() {
                try {
                    let {id , rand } = this.$route.query

                    this.isFromShare = !!rand
                    this.rand = this.isFromShare ? rand : getRandomInt(1, 6)

                    // this.rand = 1

                    this.bg = `${this.base}${page}bg${this.rand}.png`
                    this.shareBg = `${this.base}${page}bg${this.rand}.png`

// return
                    this.CHANGE_LOADING_BAR(true)
                    this.setLoadingText('设置分享...')

                    if (this.isFromShare) {
                        //从分享进来，从服务器拿分享的录音视频链接
                        let {musicUrl ,userHead,userName } = await getAvater(id)

                        console.log('origin : ' , musicUrl ,userHead)
                        const base64 = 'data:image/jpg;base64,'
                        let head = base64 + userHead
                        // musicUrl = musicUrl.substring(1, musicUrl.length-1)
                        console.log('head' , head)
                        this.setheadimgurl(head)
                        this.setnickname(userName)
                        const t = JSON.parse(musicUrl)


                        console.log('json' , t)

                        this.settimeline(t)


                    }else{
                        const timeline = JSON.stringify(this.timeline)
                        const res = await uploadRecord(this.openid , timeline)
                        console.log('return upload' , res)
                        id = res.id

                        const base64 = 'data:image/jpg;base64,'
                        let head = res.userHead
                        head = base64 + res.userHead
                        this.setheadimgurl(head)
                    }

                    let link = window.location.href.split('?')[0]
                    //分享link强制?#模式，否则android会截断?后的query
                    link  = link.replace('#' , '?#')
                    link = `${link}?id=${id}&rand=${this.rand}`

                    const imgUrl = this.shareBg

                    await initShare(link , imgUrl)

                } catch (e) {
                    console.log('error ', e)
                } finally {
                    this.CHANGE_LOADING_BAR(false)
                }
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
                this.$sound.play(key)
            },
            startPlayRecord() {
                this.isPlaying = true
                this.startTime = this.getTime()
                this.cloneTimeline = [...this.timeline]
                let endTime = this.cloneTimeline.pop()
                console.log('timeline len :' ,  this.cloneTimeline.length)
                this.playRecordTime = setInterval(() => {
                    const offTime = this.getTime() - this.startTime

                    if (offTime + 50 > endTime.time) {
                        if(this.playRecordTime){
                            clearInterval(this.playRecordTime)
                            this.playRecordTime = null
                        }
                        console.log('timeline len endh offtime')
                        //end
                        this.isPlaying = false
                    }
                    if(!this.isPlaying){
                        if(this.playRecordTime){
                            clearInterval(this.playRecordTime)
                            this.playRecordTime = null
                        }
                        console.log('stop play music in timeline')
                        return
                    }
                    if (this.cloneTimeline.length > 0) {
                        const cur = this.cloneTimeline[0]
                        // console.log('offTime', offTime, cur)
                        if (cur.time > offTime - 30 && cur.time < offTime + 30) {
                            this.playMusic(cur.key)
                            // this.preKey = cur.key
                            this.cloneTimeline.shift()
                            console.log('get key', cur.key)
                        }
                    }else{
                        console.log('timeline len end' ,  this.cloneTimeline.length)
                    }
                }, 20)
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

            async getOrignImage(src){
                return new Promise((res , rej)=>{
                    const img = new Image()
                    img.onload = ()=>{
                        res(img)
                    }
                    img.src = src
                })

            },
            async getImage(url){
                return new Promise((res , rej)=>{
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



                    console.log('drawImage beginPath')
                    ctx.save()
                    ctx.beginPath();
                    ctx.arc(rem(43) + rem(25)/2,
                        rem(30) + rem(25)/2,
                        rem(25)/2, 0,
                        Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    const head = await this.getOrignImage(this.headimgurl)

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

                    this.showPreview = true
                    this.$nextTick(()=>{
                        console.log('preview')
                        const img = new Image()
                        img.src = canvas.toDataURL('image/png')
                        this.isSaveImage = false
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
                window.location.href = 'http://bsxyzqy.ysmine.com/login/api/login/htmllogin'
                // this.$router.replace({name:'video'})
                // const r = window.location.origin
                // // const r = window.location.href.replace(/#[/].*/ , '#/video')
                // console.log('goto r' , r)
                // // alert(r)
                // window.location.href = r
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
    .btm6{
        position: absolute;
        bottom: 2% !important;
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

    .text1-icon2 {
        position: absolute;
        z-index: 100;
        top: 16.64%;
        height: 15.74%;
        width: 256*2px;
        left: 46*2px;
        animation: text1-icon2 $speed linear infinite alternate;
    }

    @keyframes text1-icon2 {
        0% {
            left: 34*2px;
        }
        100% {
            left: 46*2px;
        }
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

    .icon3-com{
        position: absolute;
        z-index: 100;
        top: 31.03%;
        left: 132*2px;
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

    .con6{
        background-color: #0072BE;
    }

    .img6{
        height: px(667);
    }

</style>
