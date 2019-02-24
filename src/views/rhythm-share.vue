<template>
    <div class="container">
        <img :src="bg" class="img"/>


        <img :src="playingIcon"
             class="stop-btn btn-small"
             v-if="isPlaying"
             bindtap="handlePlay"/>
        <img :src="playIcon"
             class="stop-btn btn-small"
             wx:else
             bindtap="handlePlay"/>

        <!--<div class="btn-share btn-middle" bindtap="handleShare"/>-->
        <button class="btn-share btn-middle"/>
        <div class="btn-register btn-middle" @click="handleRegister"/>

        <share-music-playing-bar class="share-music-playing-bar" v-if="isPlaying"/>

        <img src="./qr-code1.jpg" class="qr-code"/>
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

    const page = 'rhythm-share-'
    export default {
        name: "rhythm-share",
        components: {ShareMusicPlayingBar},
        computed: {
            ...mapGetters(['base']),
            // bg(){
            //     return `${this.base}${page}bg.png`
            // },
            playingIcon() {
                return `${this.base}${page}playing.png`
            },
            playIcon() {
                return `${this.base}${page}play.png`
            },
            baseUrl() {
                return `${this.base}asserts/image/pages/`
            }
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


            const rand = option && option.rand ? option.rand : getRandomInt(1, 5)
            const bg = `${this.base}${page}bg${rand}.png`
            const shareBg = `${this.base}${page}share-bg${rand}.jpg`

            this.bg = bg
            this.shareBg = shareBg
            this.rand = rand

            this.init()

        },
        methods: {
            ...mapMutations([CHANGE_LOADING_BAR, 'setLoadingText']),
            async init() {
                try {
                    this.CHANGE_LOADING_BAR(true)
                    this.setLoadingText('设置分享...')
                    this.recordId = this.$route.query.recordId
                    this.shareId = this.$route.query.shareid
                    if(this.shareId){
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
                    link = link.replace(/[/]$/ , '')
                    link = `${link}?shareid=share`
                    console.log('share link' , link)
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
                }finally {
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

<style scoped>

    .container {
        height: 100%;
        width: 100%;
        position: relative;
        margin: 0;
        padding: 0;

    }

    .qr-code {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 200px;
        height: 200px;
        z-index: 1000000;
    }

    .img {
        height: 100%;
        width: 100%;
    }

    .stop-btn {
        position: absolute;
        /*height: 4.65%;*/
        height: 60px;
        width: 145px;
        right: 0;
        top: 20.67%
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
</style>
