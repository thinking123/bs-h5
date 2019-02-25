<template>
    <div class="container">
        <img :src="bg" class="img"/>
        <move-arrow class="arrow"/>

        <img :src="textIcon1"
             v-if="showIcon1"
             :class="[`text${rand}-icon1`]"/>
        <img :src="textIcon2"
             v-if="showIcon2"
             :class="[`text${rand}-icon2`]"/>

        <img :src="textIcon1"
             v-if="showIcon1"
             :class="[`text${rand}-icon3`]"/>
        <img :src="textIcon2"
             v-if="showIcon2"
             :class="[`text${rand}-icon4`]"/>
        <share-music-playing-bar class="share-music-playing-bar" v-if="isPlaying"/>


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
</template>

<script>

    import {showMsg, getRandomInt} from "../utils/common";
    import {mapGetters, mapMutations} from 'vuex'
    import {CHANGE_LOADING_BAR} from "../store/mutations";
    import ShareMusicPlayingBar from "../components/ShareMusicPlayingBar";
    import {getSignInfo} from "../utils/http";
    import {
        wx_config,
        wx_playRecord,
        wx_stopPlayRecord,
        wx_timelineShare,
        wx_appMessageShare,
        wx_registerOnVoicePlayEnd
    } from "../utils/wx-config";
    import MoveArrow from "../components/MoveArrow";

    const page = 'rhythm-share-'
    export default {
        name: "rhythm-share",
        components: {MoveArrow, ShareMusicPlayingBar},
        computed: {
            ...mapGetters(['base']),
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
            textIcon1(){
                return `${this.base}${page}text${this.rand}-icon1.png`
            },
            textIcon2(){
                if(this.rand == 5){
                    return `${this.base}${page}text${this.rand}-icon1.png`
                }
                return `${this.base}${page}text${this.rand}-icon2.png`
            },
            showIcon1(){
                return this.rand != 3
            },
            showIcon2(){

                return this.rand == 4 || this.rand == 5 || this.rand == 6
            },
            // textIconCls1(){
            //     const clsName = `text${this.rand}-icon1`
            //     return {
            //         clsName
            //     }
            // },
            // textIconCls2(){
            //     const clsName = `text${this.rand}-icon2`
            //     return {
            //         clsName
            //     }
            // }
        },
        data() {
            return {
                url: this.base,
                isPlaying: false,
                shareBg: '',
                bg: '',
                rand: 1,
            }
        },
        mounted(option) {


            const rand = 4
            // const rand = option && option.rand ? option.rand : getRandomInt(1, 6)
            const bg = `${this.base}${page}bg${rand}.png`
            const shareBg = `${this.base}${page}share-bg${rand}.jpg`

            this.bg = bg
            this.shareBg = shareBg
            this.rand = rand
            // this.rand = 2

            this.init()

        },
        methods: {
            ...mapMutations([CHANGE_LOADING_BAR, 'setLoadingText']),
            async init() {
                try {
                    // this.CHANGE_LOADING_BAR(true)
                    this.setLoadingText('设置分享...')
                    this.recordId = this.$route.query.recordId
                    this.shareId = this.$route.query.shareid
                    if (this.shareId) {
                        //从分享也进来，从服务器拿分享的录音视频链接
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

                    const title = 'h5微信分享'
                    const desc = 'h5微信分享内容'
                    let link = window.location.href
                    link = link.replace(/[/]$/, '')
                    link = `${link}?shareid=share`
                    console.log('share link', link)
                    const imgUrl = 'http://pn3yoa4tm.bkt.clouddn.com/home-bg.png'
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

            handleDownloadImage(){

            },
            handleGoToHome(){

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

    .container {
        height: 100%;
        width: 100%;
        position: relative;
        margin: 0;
        padding: 0;

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

    $speed:3s;
    $speed6:$speed;
    $speed4:$speed;
    .text1-icon1{
        position: absolute;
        z-index: 100;
        top:16.64%;
        height: 15.74%;
        width: 256*2px;
        left: 40*2px;
    }
    .text2-icon1{
        position: absolute;
        z-index: 100;
        top:34.78%;
        height: 23*2px;
        width: 23*2px;
        left: 40*2px;
    }


    .text4-icon1{
        position: absolute;
        z-index: 100;
        top:80.51%;
        height: 25*2px;
        width: 25*2px;
        right:190*2px;
        animation: text4-icon1 $speed4 linear $speed4 infinite;
    }
    @keyframes  text4-icon1{
        from{
            right:190*2px;
            transform: translateX(100%);
        }
        to{
            right:315*2px;
        }
    }

    .text4-icon2{
        position: absolute;
        z-index: 100;
        top:80.51%;
        height: 25*2px;
        width: 25*2px;
        right:160*2px;
        animation: text4-icon2 $speed4 linear $speed4  infinite;
    }
    @keyframes  text4-icon2{
        from{
            right:160*2px;
            transform: translateX(100%);
        }
        to{
            right:285*2px;
        }
    }
    .text4-icon3{
        position: absolute;
        z-index: 100;
        top:80.51%;
        height: 25*2px;
        width: 25*2px;
        right:130*2px;
        animation: text4-icon3 $speed4 linear $speed4 infinite;
    }
    @keyframes  text4-icon3{
        from{
            right:130*2px;
            transform: translateX(100%);
        }
        to{
            right:255*2px;
        }
    }
    .text4-icon4{
        position: absolute;
        z-index: 100;
        top:80.51%;
        height: 25*2px;
        width: 25*2px;
        animation: text4-icon4 $speed4 linear infinite;
    }
    @keyframes  text4-icon4{
        from{
            right:100*2px;
            transform: translateX(100%);
        }
        to{
            right:225*2px;
        }
    }
    .text5-icon1{
        position: absolute;
        z-index: 100;
        top:72.51%;
        height: 1.95%;
        width: 93*2px;
        left: 40*2px;
    }
    .text5-icon2{
        position: absolute;
        z-index: 100;
        top:75.56%;
        height: 2.55%;
        width: 122*2px;
        left: 40*2px;
    }
    .text5-icon3{
        position: absolute;
        z-index: 100;
        top:79.91%;
        height: 3.45%;
        width: 162*2px;
        left: 40*2px;
    }

    .text6-icon1{
        position: absolute;
        z-index: 100;
        top:30.88%;
        height: 13.34%;
        width: 148*2px;
        left: 0;
        animation: text6-icon1 $speed6 linear infinite;
    }
    @keyframes  text6-icon1{
        from{
            left:0;
            transform: translateX(-100%);
        }
        to{
            left: 100%;
        }
    }

    .text6-icon2{
        position: absolute;
        z-index: 100;
        top:50.97%;
        height: 13.34%;
        width: 153*2px;
        right: 0;
        animation: text6-icon2 $speed6 linear infinite;
    }
    @keyframes  text6-icon2{
        from{
            right:0;
            transform: translateX(100%);
        }
        to{
            right: 100%;
        }
    }
</style>
