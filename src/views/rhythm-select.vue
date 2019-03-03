<template>
    <div class="container">
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

        <img :src="bg" class="img"/>
        <img :src="startBtn"
             class="record-btn btn-middle"
             @click="handleRecord"/>

        <img :src="pauseBtn"
             class="stop-btn btn-middle"
             v-if="isPlaying"
             @click="handlePlay"/>
        <img :src="stopBtn"
             class="stop-btn btn-middle"
             v-else
             @click="handlePlay"/>

        <img :src="yp"
             class="yp-wrap"/>
        <img :src="downIcon"
             :style="style1"
             class="icon icon1 "/>
        <img :src="downIcon"
             :style="{animationName: (icon2Taped ? 'taped2' : '')}"
             class="icon icon2 "/>
        <img :src="downIcon"
             :style="{animationName:icon3Taped ? 'taped3' : ''}"
             class="icon icon3 "/>
        <img :src="downIcon"
             :style="{animationName:icon4Taped ? 'taped4' : ''}"
             class="icon icon4 "/>
        <img :src="downIcon"
             :style="{animationName:icon5Taped ? 'taped5' : ''}"
             class="icon icon5 "/>

        <img :src="upIcon"
             :style="{animationName:icon6Taped ? 'taped6' : ''}"
             class="icon icon6 "/>
        <img :src="upIcon"
             :style="{animationName:icon7Taped ? 'taped7' : ''}"
             class="icon icon7 "/>


        <img :src="shareBtn"
             class="music-person-btn"
             @click="handleMusicPerson"/>

        <start-recording-bar class="start-recording-bar" v-if="isRecording"/>
        <music-btn class="music-btn row1 music-btn1" text="Do" @touching="handleTouching" musicKey="do"/>
        <music-btn class="music-btn row1 music-btn2" text="Re" @touching="handleTouching" musicKey="re"/>
        <music-btn class="music-btn row1 music-btn3" text="Mi" @touching="handleTouching" musicKey="mi"/>
        <music-btn class="music-btn row1 music-btn4" text="Fa" @touching="handleTouching" musicKey="fa"/>
        <music-btn class="music-btn row2 music-btn5" text="Sol" @touching="handleTouching" musicKey="sol"/>
        <music-btn class="music-btn row2 music-btn6" text="La" @touching="handleTouching" musicKey="la"/>
        <music-btn class="music-btn row2 music-btn7" text="Xi" @touching="handleTouching" musicKey="xi"/>



    </div>

</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    import MusicBtn from "../components/MusicBtn";
    import StartRecordingBar from "../components/StartRecordingBar";
    import {getSignInfo} from "../utils/http";
    import {showMsg} from "../utils/common";
    import {
        wx_config,
        wx_startRecord,
        wx_stopRecord,
        wx_playRecord,
        wx_stopPlayRecord,
        wx_registerOnVoicePlayEnd
    } from "../utils/wx-config";
    import {CHANGE_LOADING_BAR} from "../store/mutations";

    const page = 'rhythm-select-'

    const recordMaxTime = 10
    const options = {
        duration: 60000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'aac',
        frameSize: 50
    }

    export default {
        name: "rhythm-select",
        components: {StartRecordingBar, MusicBtn},
        computed: {
            ...mapGetters(['base']),
            style1() {
                return {animationName: this.icon1Taped ? 'taped1' : ''}
            },
            bg() {
                return `${this.base}${page}bg.png`
            },
            startBtn() {
                return `${this.base}${page}start-record-btn1.png`
            },
            pauseBtn() {
                return `${this.base}${page}pause-btn.png`
            },
            stopBtn() {
                return `${this.base}${page}stop-btn.png`
            },
            yp() {
                return `${this.base}${page}yp.png`
            },
            downIcon() {
                return `${this.base}${page}down-icon.png`
            },
            upIcon() {
                return `${this.base}${page}up-icon.png`
            },
            shareBtn() {
                return `${this.base}${page}to-share-btn.png`
            }
        },
        mounted() {
            this.init()
        },
        data() {
            return {
                url: this.base,
                isPlaying: false,
                isPlayingAudio: false,

                isRecording: false,
                isRecorded: false,
                //最大录音时间 10s
                remainTime: recordMaxTime,
                //是否点击了音乐按钮
                isPressMusicBtn: false,
                tempFilePath: null,
                icon1Taped: false,
                icon2Taped: false,
                icon3Taped: false,
                icon4Taped: false,
                icon5Taped: false,
                icon6Taped: false,
                icon7Taped: false,

                timeline: []
            }
        },
        methods: {
            ...mapMutations([CHANGE_LOADING_BAR, 'setLoadingText']),
            async init() {
                console.log(window.location.href)
                try {
                    this.CHANGE_LOADING_BAR(true)
                    this.setLoadingText('设置录音...')
                    const {
                        appid,
                        noncestr,
                        signature,
                        timestamp
                    } = await getSignInfo(window.location.href)
                    const jsApiList = [
                        'startRecord',
                        'stopRecord',
                        'onVoiceRecordEnd',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'onVoicePlayEnd',
                        'uploadVoice',
                        'downloadVoice'
                    ]
                    await wx_config(appid, timestamp, noncestr, signature, jsApiList)

                    wx_registerOnVoicePlayEnd(() => {
                        console.log('语音播放完毕')
                        this.isPlaying = false
                    })
                    console.log('wx jdk init success')
                } catch (e) {
                    console.log('error ', e)
                } finally {
                    this.CHANGE_LOADING_BAR(false)
                }
            },
            audioend(item) {
                console.log('end music', item)
                this.curAudio = null
                this.isPlayingAudio = false
            },
            stopaudio() {
                if (this.isPlayingAudio && this.curAudio) {
                    this.curAudio.pause();
                    this.curAudio.currentTime = 0;
                    this.isPlayingAudio = false
                    this.curAudio = null
                }

            },
            async handleRecord(e) {
                if (this.isRecording) {
                    await this.stopRecord()
                } else {
                    this.stopaudio()
                    await this.stopPlayRecord()
                    this.startRecord()
                }
            },
            handlePlay(e) {
                if (!this.isHadRecord()) {
                    this.showModal('您还没有录音')
                    return
                }

                if (this.isPlaying) {
                    this.stopPlayRecord()
                    wx_stopPlayRecord(this.tempFilePath)
                } else {
                    this.stopaudio()
                    this.startPlayRecord()
                    wx_playRecord(this.tempFilePath)
                }
            },
            handleSave(e) {
                if (!this.isHadRecord()) {
                    this.showModal('您还没有录音')
                    return
                }
                this._saveFile()
                console.log('handleSave')
            },
            async _saveFile() {
                try {
                    showLoading('正在保存...')
                    console.log('this.tempFilePath', this.tempFilePath)
                    const path = await saveFile(this.tempFilePath, recordDir)
                    this.setData({
                        tempFilePath: path
                    })
                } catch (e) {
                    showMsg(e)
                } finally {
                    hideLoading()
                }
            },
            handleMusicPerson(e) {
                if (!this.isHadRecord()) {
                    this.showModal('您还没有录音')
                    return
                }
                this.$router.push({
                    name: 'individuality',
                    query: {
                        recordId: this.tempFilePath
                    }
                })
            },
            handleTouching(e, notPlay = false) {
                const key = e

                if (this.isRecording) {
                    this.timeline.push({
                        key: key,
                        time: (this.getTime() - this.startTime)
                    })

                    console.log('lenght', this.timeline.length)
                }
                switch (key) {
                    case 'do':
                        this.icon1Taped = true
                        this.playTime = setTimeout(() => {
                            this.icon1Taped = false
                            clearTimeout(this.playTime)
                        }, 250)

                        break
                    case 're':
                        this.icon2Taped = true
                        this.playTime = setTimeout(() => {
                            this.icon2Taped = false
                            clearTimeout(this.playTime)
                        }, 250)

                        break
                    case 'mi':
                        this.icon3Taped = true
                        this.playTime = setTimeout(() => {
                            this.icon3Taped = false
                            clearTimeout(this.playTime)
                        }, 250)

                        break
                    case 'fa':
                        this.icon4Taped = true
                        this.playTime = setTimeout(() => {
                            this.icon4Taped = false
                            clearTimeout(this.playTime)
                        }, 250)

                        break
                    case 'sol':
                        this.icon5Taped = true
                        this.playTime = setTimeout(() => {
                            this.icon5Taped = false
                            clearTimeout(this.playTime)
                        }, 250)

                        break
                    case 'la':
                        this.icon6Taped = true
                        this.playTime = setTimeout(() => {
                            this.icon6Taped = false
                            clearTimeout(this.playTime)
                        }, 250)

                        break
                    case 'xi':
                        this.icon7Taped = true
                        this.playTime = setTimeout(() => {
                            this.icon7Taped = false
                            clearTimeout(this.playTime)
                        }, 250)

                        break
                }
                if (!notPlay) {
                    this.playMusic(key)
                }

            },
            startPlayRecord() {
                // this.setData({
                //     isPlaying: true
                // })
                this.isPlaying = true
                this.startTime = this.getTime()
                this.cloneTimeline = [...this.timeline]
                this.playRecordTime = setInterval(() => {
                    const offTime = this.getTime() - this.startTime

                    if (this.cloneTimeline.length > 0) {
                        const cur = this.cloneTimeline[0]
                        console.log('offTime', offTime, cur)
                        if (cur.time > offTime - 50 && cur.time < offTime + 50) {
                            this.handleTouching(cur.key, true)
                            this.cloneTimeline.shift()
                            console.log('get key', cur.key)
                        }
                    } else {
                        clearInterval(this.playRecordTime)
                    }
                }, 90)
            },
            stopPlayRecord() {
                this.isPlaying = false
                clearInterval(this.playRecordTime)
            },
            getTime() {
                const d = new Date()
                const t = d.getTime();
                // console.log('time' , t)
                return t
            },
            async startRecord() {
                console.log('开始录音')
                // this.show('录音开始')
                await wx_startRecord()
                this.startTime = this.getTime()
                this.timeline = []
                this.isPlaying = false
                this.isPlayingAudio = false
                this.isRecording = true
                this.isPressMusicBtn = false
                this.tempFilePath = null
                this.remainTime = recordMaxTime
                this.isRecorded = false

                this.time = setInterval(() => {
                    const remain = --this.remainTime
                    console.log('remain', remain)
                    this.remainTime = remain

                    if (remain <= 0) {
                        this.stopRecord()
                    }
                }, 1000)
            },
            async stopRecord() {

                console.log('stopRecord')
                if (this.time) {
                    clearInterval(this.time)
                    this.time = null
                }
                const tempFilePath = await wx_stopRecord()
                this.isRecording = false
                this.tempFilePath = tempFilePath
                this.isRecorded = this.isPressMusicBtn
            },
            isHadRecord() {
                return this.isRecorded
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
            show(msg) {
                const obj = {
                    title: msg,
                }
                wx.showToast(obj)
            },
            showModal(msg, title = '') {
                showMsg(msg)
                // wx.showModal({
                //     title: title.length === 0 ? '提示' : title,
                //     content: msg,
                //     success(res) {
                //         if (res.confirm) {
                //             console.log('用户点击确定')
                //         } else if (res.cancel) {
                //             console.log('用户点击取消')
                //         }
                //     }
                // })
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

                console.log('beforeRouteLeave clear')
                clearInterval(this.playRecordTime)
                this.playRecordTime = null

                clearInterval(this.time)
                this.time = null

                if (this.isRecording) {
                    await wx_stopRecord()
                    this.stopaudio()
                }

            }catch (e) {
                console.error('beforeRouteLeave' , e)
            }finally {
                next()
            }


        }
    }
</script>

<style scoped>

    .to-share{
        z-index: 10000;
        position: fixed;
        top:32px;
        right:32px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        width: 64px;
        height: 64px;
        border-radius: 64px;
        border: 0;
        margin: 0;
    }
    .container {
        height: 100%;
        width: 100%;
        position: relative;
        margin: 0;
        padding: 0;

    }

    /*.container > view {*/
    /*background-color: yellow;*/
    /*}*/
    .img {
        height: 100%;
        width: 100%;
    }

    .yp-wrap {
        position: absolute;
        top: 63.87%;
        left: 50%;
        transform: translateX(-50%);
        height: 6.75%;
        width: 418px;
    }

    /*
    H :90 px
    iconH:56 px

    top:442
    */
    .icon {
        position: absolute;
        height: 4.2%;
        width: 20px;

        animation-name: taped1;
        animation-timing-function: ease-in;
        animation-direction: alternate;
        animation-duration: 0.25s;
    }

    .icon1 {
        top: 66.27%;
        left: 260px;
    }

    .icon2 {
        top: 65.82%;
        left: 300px;
    }

    .icon3 {
        top: 65.37%;
        left: 340px;
    }

    .icon4 {
        top: 64.92%;
        left: 380px;
    }

    .icon5 {
        top: 64.67%;
        left: 420px;
    }

    .icon6 {
        top: 65.82%;
        left: 460px;
    }

    .icon7 {
        top: 65.37%;
        left: 500px;
    }

    .down-icon-taped {
        /*animation: taped 0.3s ease-in  alternate;*/
        /*animation-name: taped1;*/

    }

    @keyframes taped1 {
        0% {
            top: 66.27%;
        }
        100% {
            top: 65.27%;
        }
    }

    @-moz-keyframes taped1 {
        0% {
            top: 66.27%;
        }
        100% {
            top: 65.27%;
        }
    }

    @-webkit-keyframes taped1 {
        0% {
            top: 66.27%;
        }
        100% {
            top: 65.27%;
        }
    }

    @keyframes taped2 {
        0% {
            top: 65.82%;
        }
        100% {
            top: 64.82%;
        }
    }

    @keyframes taped3 {
        0% {
            top: 65.37%;
        }
        100% {
            top: 64.37%;
        }
    }

    @keyframes taped4 {
        0% {
            top: 64.92%;
        }
        100% {
            top: 63.92%;
        }
    }

    @keyframes taped5 {
        0% {
            top: 64.67%;
        }
        100% {
            top: 63.67%;
        }
    }

    @keyframes taped6 {
        0% {
            top: 65.82%;
        }
        100% {
            top: 66.82%;
        }
    }

    @keyframes taped7 {
        0% {
            top: 65.37%;
        }
        100% {
            top: 66.37%;
        }
    }

    .yp-wrap.music {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .btn-middle {
        position: absolute;
        height: 5.1%;
        width: 208px;
    }

    .record-btn {
        top: 57.87%;
        left: 50%;
        transform: translateX(-50%);
    }

    .stop-btn {
        top: 73.26%;
        left: 50%;
        transform: translateX(-50%);
    }

    .save-btn {
        top: 75.26%;
        left: 386px;
    }


    .re-record-btn {
        position: absolute;
        height: 3.75%;
        width: 184px;
        top: 47.38%;
        left: 280px;
    }

    .music {
        position: absolute;
        top: 66.27%;
        height: 7.95%;
        width: 394px;
        left: 50%;
        transform: translateX(-50%);
    }


    .music-person-btn {
        position: absolute;
        top: 85.16%;
        height: 7.78%;
        width: 394px;
        left: 50%;
        transform: translateX(-50%);
    }


    .select-bar {
        position: absolute;
        height: 6px;
        width: 148px;
        top: 38.23%;
        background-color: white;
    }


    .dev {
        position: absolute;
        width: 146px;
        height: 3.6%;
        top: 38.98%;
        /*background-color: gold;*/
    }

    .dev1 {
        left: 136px;
    }

    .dev2 {
        left: 300px;
    }

    .dev3 {
        left: 460px;
    }

    .upload-my-music {
        position: absolute;
        height: 7.2%;
        width: 336px;
        top: 82.91%;
        left: 206px;
    }

    .start-recording-bar {
        position: absolute;
        /*height: 7.2%;*/
        /*width: 336px;*/
        top: 59.52%;
        left: 306px;
    }

    .music-btn {
        /*z-index: 100;*/
        /*position: absolute;*/
        /*height: 7.8%;*/
        width: 96px;

        /*background-size: 100% 100%;*/
        /*background-repeat: no-repeat;*/
        /*display: flex;*/
        /*justify-content: center;*/
        /*align-items: center;*/
        /*font-weight: bold;*/
        /*color: #0094FF;*/
        /*font-size: 50px;*/
    }

    .row1 {
        top: 40.33%;
    }

    .row2 {
        top: 48.87%;
    }

    .music-btn1 {
        left: 160px;
    }

    .music-btn5 {
        left: 216px;
    }

    .music-btn2 {
        left: 270px;
    }

    .music-btn6 {
        left: 324px;
    }

    .music-btn3 {
        left: 380px;
    }

    .music-btn7 {
        left: 436px;
    }

    .music-btn4, .music-btn8 {
        left: 490px;
    }

</style>
