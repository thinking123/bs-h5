<template>
    <div class="container">
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
               wx:else
               @click="handlePlay"/>

        <img :src="yp"
               class="yp-wrap"/>
        <img :src="downIcon"
               :style="{animationName: icon1Taped ? 'taped1' : ''}"
               class="icon icon1 "/>
        <img :src="downIcon"
               :style="{animationName:icon2Taped ? 'taped2' : ''}"
               class="icon icon2 "/>
        <img :src="downIcon"
               :style="{animationName:icon3Taped ? 'taped3' : ''}"
               class="icon icon3 "/>
        <img :src="downIcon"
               :style="{animationName:icon4Taped ? 'taped4' : ''}"
               class="icon icon4 {"/>
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

        <start-recording-bar class="start-recording-bar"  v-if="isRecording"/>
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
    import {mapGetters} from 'vuex'

    import MusicBtn from "../components/MusicBtn";
    import StartRecordingBar from "../components/StartRecordingBar";
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
            bg(){
                return `${this.base}${page}bg.png`
            },
            startBtn(){
                return `${this.base}${page}start-record-btn.png`
            },
            pauseBtn(){
                return `${this.base}${page}pause-btn.png`
            },
            stopBtn(){
                return `${this.base}${page}stop-btn.png`
            },
            yp(){
                return `${this.base}${page}yp.png`
            },
            downIcon(){
                return `${this.base}${page}down-icon.png`
            },
            upIcon(){
                return `${this.base}${page}up-icon.png`
            },
            shareBtn(){
                return `${this.base}${page}to-share-btn.png`
            }
        },
        data(){
            return {
                left: '136px',
                url: this.base,
                isPlaying: false,
                isRecording: false,
                isRecorded: false,
                //最大录音时间 10s
                remainTime: recordMaxTime,
                //是否点击了音乐按钮
                isPressMusicBtn: false,
                tempFilePath: null,
                icon1Taped:false,
                icon2Taped:false,
                icon3Taped:false,
                icon4Taped:false,
                icon5Taped:false,
                icon6Taped:false,
                icon7Taped:false,

                timeline:[]
            }
        },
        methods: {
            handleDev(e) {
                const data = e.target.dataset.dev
                let left = 0

                switch (data) {
                    case "0" :
                        left = 68 * 2;
                        break
                    case "1" :
                        left = 149 * 2;
                        break
                    case "2" :
                        left = 230 * 2;
                        break

                }

                left += 'rpx'

                console.log('handleDev', data, left)
                this.setData({
                    left: left
                })

            },
            handleRecord(e) {
                if (this.data.isRecording) {
                    this.recorderManager.stop()

                    // this.stopRecord()
                } else {
                    //IOS 开始录音的时候不能为静音模式
                    //或者开启 播放录音的:obeyMuteSwitch
                    this.recorderManager.start(options)


                    // this.startRecord()
                }
            },
            handlePlay(e) {
                // this.setData({
                //     isPlaying: true
                // })

                // return
                if (!this.isHadRecord()) {
                    this.showModal('您还没有录音')
                    return
                }

                this.startPlayRecord()
                if (this.data.isPlaying) {
                    this.ctx.stop()
                    this.setData({
                        isPlaying: false
                    })
                } else {
                    this.ctx.src = this.data.tempFilePath
                    this.ctx.play()
                    this.setData({
                        isPlaying: true
                    })
                }
                // this.setData({
                //     isPlaying: !this.data.isPlaying
                // })
            },
            handleSave(e) {
                if (!this.isHadRecord()) {
                    this.showModal('您还没有录音')
                    return
                }
                this._saveFile()
                console.log('handleSave')
            },
            async _saveFile(){
                try {
                    showLoading('正在保存...')
                    console.log('this.data.tempFilePath' , this.data.tempFilePath)
                    const path = await saveFile(this.data.tempFilePath , recordDir)
                    this.setData({
                        tempFilePath:path
                    })
                }catch (e) {
                    showMsg(e)
                }finally {
                    hideLoading()
                }
            },
            handleMusicPerson(e) {
                if (!this.isHadRecord()) {
                    this.showModal('您还没有录音')
                    return
                }

                // if(this.ctx){
                //     this.ctx.stop()
                // }
                // if(this.time){
                //     clearInterval(this.time)
                //     this.time = null
                // }
                // if(this.recorderManager){
                //     this.recorderManager.stop()
                // }


                const url = `/pages/rhythm-share/index?temppath=${this.data.tempFilePath}`
                console.log('url' , url)
                wx.navigateTo({
                    url: url
                })
            },
            setTaped(key){

            },
            handleTouching(e , notPlay = false) {
                const key = e.detail

                if(this.data.isRecording){
                    this.timeline.push({
                        key:key,
                        time:(this.getTime() - this.startTime)
                    })

                    console.log('lenght' , this.timeline.length)
                }
                switch (key) {
                    case 'do':
                        this.setData({
                            icon1Taped: true
                        })
                        this.playTime = setTimeout(()=>{
                            this.setData({
                                icon1Taped: false
                            })
                            clearTimeout(this.playTime)
                        } , 250)

                        break
                    case 're':
                        this.setData({
                            icon2Taped: true
                        })
                        this.playTime = setTimeout(()=>{
                            this.setData({
                                icon2Taped: false
                            })
                            clearTimeout(this.playTime)
                        } , 250)

                        break
                    case 'mi':
                        this.setData({
                            icon3Taped: true
                        })
                        this.playTime = setTimeout(()=>{
                            this.setData({
                                icon3Taped: false
                            })
                            clearTimeout(this.playTime)
                        } , 250)

                        break
                    case 'fa':
                        this.setData({
                            icon4Taped: true
                        })
                        this.playTime = setTimeout(()=>{
                            this.setData({
                                icon4Taped: false
                            })
                            clearTimeout(this.playTime)
                        } , 250)

                        break
                    case 'sol':
                        this.setData({
                            icon5Taped: true
                        })
                        this.playTime = setTimeout(()=>{
                            this.setData({
                                icon5Taped: false
                            })
                            clearTimeout(this.playTime)
                        } , 250)

                        break
                    case 'la':
                        this.setData({
                            icon6Taped: true
                        })
                        this.playTime = setTimeout(()=>{
                            this.setData({
                                icon6Taped: false
                            })
                            clearTimeout(this.playTime)
                        } , 250)

                        break
                    case 'xi':
                        this.setData({
                            icon7Taped: true
                        })
                        this.playTime = setTimeout(()=>{
                            this.setData({
                                icon7Taped: false
                            })
                            clearTimeout(this.playTime)
                        } , 250)

                        break
                }
                if(!notPlay){
                    this.playMusic(key)
                }

            },
            startPlayRecord(){
                // this.setData({
                //     isPlaying: true
                // })
                this.startTime = this.getTime()
                this.cloneTimeline = [...this.timeline]
                this.playRecordTime = setInterval(()=>{
                    const offTime = this.getTime() - this.startTime

                    if(this.cloneTimeline.length > 0){
                        const cur = this.cloneTimeline[0]
                        console.log('offTime' , offTime  ,cur)
                        if(cur.time > offTime - 50 && cur.time < offTime + 50){
                            this.handleTouching({
                                detail:cur.key
                            } , true)
                            this.cloneTimeline.shift()
                            console.log('get key' , cur.ley)
                        }
                    }else{
                        clearInterval(this.playRecordTime)
                    }
                } , 90)
            },
            stopPlayRecord(){
                this.setData({
                    isPlaying: false
                })
                clearInterval(this.playRecordTime)
            },
            getTime(){
                const d = new Date()
                const t = d.getTime();
                // console.log('time' , t)
                return t
            },
            startRecord(){
                // this.show('录音开始')
                this.startTime = this.getTime()
                this.timeline = []

                this.setData({
                    isPlaying: false,
                    isRecording:true,
                    isPressMusicBtn:false,
                    tempFilePath:null,
                    remainTime:recordMaxTime,
                    isRecorded:false
                })

                this.ctx.stop()
                this.ctx.src = null

                this.time = setInterval(()=>{
                    const remain = --this.data.remainTime
                    console.log('remain' , remain)
                    this.setData({
                        remainTime: remain
                    })

                    if(remain <= 0){
                        this.recorderManager.stop()
                    }
                } , 1000)
            },
            stopRecord(tempFilePath){

                // this.show('录音结束')
                if(this.time){
                    clearInterval(this.time)
                    this.time = null
                }


                this.setData({
                    isPlaying: false,
                    isRecording: false,
                    tempFilePath:tempFilePath,
                    isRecorded:this.data.isPressMusicBtn
                })

                this.ctx.stop()
                this.ctx.src = null
            },
            onLoad() {
                this.recorderManager = wx.getRecorderManager()

                this.recorderManager.onStart(() => {
                    this.startRecord()
                })
                this.recorderManager.onPause(() => {
                    console.log('recorder pause')
                })
                this.recorderManager.onStop((res) => {
                    const {tempFilePath} = res
                    this.stopRecord(res.tempFilePath)
                })
                this.recorderManager.onFrameRecorded((res) => {
                    const {frameBuffer} = res
                    console.log('frameBuffer.byteLength', frameBuffer.byteLength)
                })
                this.recorderManager.onError((err) => {
                    console.log('onError', err.errMsg)
                    this.stopRecord(null)
                })

                this.recorderManager.onInterruptionBegin((err) => {
                    console.log('onInterruptionBegin', err)
                })

                this.recorderManager.onInterruptionEnd((err) => {
                    console.log('onInterruptionEnd', err)
                })


                this.ctx = wx.createInnerAudioContext()

                // this.ctx.autoplay = true
                /*
                * obeyMuteSwitch	boolean	true	否
                * （仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
                * */
                wx.setInnerAudioOption({
                    obeyMuteSwitch: false
                })
                this.ctx.onPlay(() => {
                    console.log('开始播放')
                    // this.show('开始播放')
                    // this.startPlayRecord()
                })
                this.ctx.onEnded(() => {
                    console.log('播放结束')
                    this.stopPlayRecord()
                    // this.setData({
                    //     isPlaying: false
                    // })
                    // this.show('播放结束')
                })
                this.ctx.onError((res) => {
                    // this.stopPlayRecord()
                    // console.log(res.errMsg)
                    // console.log(res.errCode)
                    this.setData({
                        isPlaying: false
                    })
                    // this.showModal(err.errMsg , 'ctx onError')
                })

            },
            isHadRecord() {
                return this.data.isRecorded
            },
            playMusic(key) {
                const ctx = this.ctx
                //停止之前的播放
                ctx.stop()

                this.setData({
                    isPlaying: false,
                    isPressMusicBtn: this.data.isRecording
                })


                const b = `${url}${key}.mp3`
                // showMsg(b)
                ctx.src = b
                ctx.play()
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
            },
            clearResource(){
                if(this.ctx){
                    this.ctx.stop()
                    this.ctx.destroy()
                    this.ctx = null
                }
                if(this.time){
                    clearInterval(this.time)
                    this.time = null
                }
                if(this.recorderManager){
                    this.recorderManager.stop()
                    this.recorderManager = null
                }
            },
            onHide(){
                if(this.ctx){
                    this.data.isPlaying && this.ctx.stop()
                }
                if(this.time){
                    clearInterval(this.time)
                    this.time = null
                }
                if(this.recorderManager){
                    this.data.isRecording && this.recorderManager.stop()
                }
            },
            onUnload(){
                this.clearResource()
            }
        }
    }
</script>

<style scoped>

    .container{
        height: 100%;
        width: 100%;
        position: relative;
        margin:0;
        padding:0;

    }

    /*.container > view {*/
    /*background-color: yellow;*/
    /*}*/
    .img{
        height: 100%;
        width: 100%;
    }

    .yp-wrap{
        position: absolute;
        top:63.87%;
        left:50%;
        transform: translateX(-50%);
        height: 6.75%;
        width: 418px;
    }
    /*
    H :90 px
    iconH:56 px

    top:442
    */
    .icon{
        position: absolute;
        height: 4.2%;
        width: 20px;

        animation-timing-function: ease-in;
        animation-direction: alternate;
        animation-duration: 0.25s;
    }
    .icon1{
        top:66.27%;
        left:260px;
    }
    .icon2{
        top:65.82%;
        left:300px;
    }
    .icon3{
        top:65.37%;
        left:340px;
    }
    .icon4{
        top:64.92%;
        left:380px;
    }
    .icon5{
        top:64.67%;
        left:420px;
    }
    .icon6{
        top:65.82%;
        left:460px;
    }
    .icon7{
        top:65.37%;
        left:500px;
    }
    .down-icon-taped{
        /*animation: taped 0.3s ease-in  alternate;*/
        /*animation-name: taped1;*/

    }
    @keyframes taped1 {
        0%{
            top:66.27%;
        }
        100%{
            top:65.27%;
        }
    }
    @keyframes taped2 {
        0%{
            top:65.82%;
        }
        100%{
            top:64.82%;
        }
    }
    @keyframes taped3 {
        0%{
            top:65.37%;
        }
        100%{
            top:64.37%;
        }
    }
    @keyframes taped4 {
        0%{
            top:64.92%;
        }
        100%{
            top:63.92%;
        }
    }
    @keyframes taped5 {
        0%{
            top:64.67%;
        }
        100%{
            top:63.67%;
        }
    }
    @keyframes taped6 {
        0%{
            top:65.82%;
        }
        100%{
            top:66.82%;
        }
    }
    @keyframes taped7 {
        0%{
            top:65.37%;
        }
        100%{
            top:66.37%;
        }
    }
    .yp-wrap.music{
        position: relative;
        height: 100%;
        width: 100%;
    }

    .btn-middle{
        position: absolute;
        height: 5.1%;
        width: 208px;
    }

    .record-btn{
        top:57.87%;
        left:50%;
        transform: translateX(-50%);
    }
    .stop-btn{
        top:75.26%;
        left:50%;
        transform: translateX(-50%);
    }
    .save-btn{
        top:75.26%;
        left:386px;
    }



    .re-record-btn{
        position: absolute;
        height: 3.75%;
        width: 184px;
        top:47.38%;
        left:280px;
    }
    .music{
        position: absolute;
        top:66.27%;
        height: 7.95%;
        width: 394px;
        left:50%;
        transform: translateX(-50%);
    }


    .music-person-btn{
        position: absolute;
        top:85.16%;
        height: 7.78%;
        width: 394px;
        left:50%;
        transform: translateX(-50%);
    }






    .select-bar{
        position: absolute;
        height: 6px;
        width: 148px;
        top:38.23%;
        background-color: white;
    }


    .dev{
        position: absolute;
        width: 146px;
        height: 3.6%;
        top:38.98%;
        /*background-color: gold;*/
    }
    .dev1{
        left:136px;
    }
    .dev2{
        left:300px;
    }
    .dev3{
        left:460px;
    }
    .upload-my-music{
        position: absolute;
        height: 7.2%;
        width: 336px;
        top:82.91%;
        left:206px;
    }

    .start-recording-bar{
        position: absolute;
        /*height: 7.2%;*/
        /*width: 336px;*/
        top:59.52%;
        left:306px;
    }

    .music-btn{
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

    .row1{
        top:40.33%;
    }
    .row2{
        top:48.87%;
    }
    .music-btn1 {
        left:160px;
    }
    .music-btn5{
        left:216px;
    }

    .music-btn2{
        left:270px;
    }
    .music-btn6{
        left:324px;
    }
    .music-btn3{
        left:380px;
    }
    .music-btn7{
        left:436px;
    }
    .music-btn4,.music-btn8{
        left:490px;
    }

</style>
