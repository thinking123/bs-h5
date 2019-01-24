<template>
    <div class="page">
        <audio  ref="gq_do" @ended="audioend('do')">
            <source src="../assets/musics/paino1.mp3" type="audio/mpeg"/>
        </audio>
        <audio  ref="gq_ri" @ended="audioend('ri')">
            <source src="../assets/musics/paino2.mp3" type="audio/mpeg"/>
        </audio>

        <audio  ref="gq_mo" @ended="audioend('mo')">
            <source src="../assets/musics/paino3.mp3" type="audio/mpeg"/>
        </audio>
        <audio  ref="gq_fa" @ended="audioend('fa')">
            <source src="../assets/musics/paino4.mp3" type="audio/mpeg"/>
        </audio>
        <audio  ref="gq_so" @ended="audioend('so')">
            <source src="../assets/musics/paino5.mp3" type="audio/mpeg"/>
        </audio>
        <audio  ref="gq_la" @ended="audioend('la')">
            <source src="../assets/musics/paino6.mp3" type="audio/mpeg"/>
        </audio>
        <audio  ref="gq_xi" @ended="audioend('xi')">
            <source src="../assets/musics/paino7.mp3" type="audio/mpeg"/>
        </audio>
        <div class="nav-bar">
            <div v-for="(item , index) in navs" :key="item.key" class="nav-bar-item"
                 :class="{'selected':item.key === selected}"
                 @click="handleSwitchTabItem(item)"
            >
                {{item.text}}
            </div>
        </div>

        <div class="body">
            <div class="music-wrap">
                <div class="row row1 ">
                    <div class="row-col-4 center " v-for="item in row1"
                         :key="item.key">
                        <music-button @touchedButton="handleMusicClick(item)">
                            {{item.text}}
                        </music-button>
                    </div>

                </div>
                <div class="row row2">
                    <div class="row-col-4 center " v-for="item in row2"
                         :key="item.key">
                        <music-button  @touchedButton="handleMusicClick(item)">
                            {{item.text}}
                        </music-button>
                    </div>
                </div>
            </div>
            <record-button class="record_btn btn-size" @click.native="handleStartRecord"
                :text="isStartRecording ? '停止录制' : '开始录制'"
                           :start="isStartRecording"
                           :remain="remain"
            />
            <img src="../assets/img/music-bar.png" class="img"/>
            <div class="btn-group">
                <h-button class="btn btn-size" :disabled="disableBtn" @click.native="handlePlayRecord">
                    {{isPlayingRecord ? '停止': '播放' }}
                </h-button>
                <h-button class="btn btn-size" :disabled="disableBtn" @click.native="handleSaveRecord">
                    保存本地
                </h-button>
            </div>
            <h-button class="link_btn btn-size" :disabled="disableBtn" @click.native="handleGotoMusicPage">
                测试我的音乐人格
            </h-button>
            <!--<div class="footer">-->
            <!---->
            <!--</div>-->

        </div>

    </div>
</template>

<script>
    import MusicButton from "../components/MusicButton";
    import HButton from "../components/HButton";
    import {debounce} from "../utils/common";
    import {mapMutations , mapGetters} from 'vuex'
    import {wxRecordConfig , startRecord, stopRecord , playRecord , stopPlayRecord , registerOnVoicePlayEnd} from "../utils/wx-config";
    import RecordButton from "../components/RecordButton";

    export default {
        name: "ArrangementsInteract",
        components: {RecordButton, HButton, MusicButton},
        computed: {
            ...mapGetters(['recordId']),
            disableBtn(){
                return !this.recordId
            }
        },
        data() {
            return {
                navs: [
                    {key: 'gq', text: '钢琴'},
                    {key: 'jt', text: '吉他'},
                    {key: 'gz', text: '古筝'},
                ],
                selected: 'gq',
                row1: [
                    {key: 'do', text: 'Do'},
                    {key: 'ri', text: 'Ro'},
                    {key: 'mo', text: 'Mo'},
                    {key: 'fa', text: 'Fo'},
                ],
                row2: [
                    {key: 'so', text: 'So'},
                    {key: 'la', text: 'La'},
                    {key: 'xi', text: 'Xi'}
                ],
                recorded:false,
                pre:null,
                //是否点击了按钮
                hadPressedMusicButton:false,

                isPlaying:false,
                isPlayingRecord:false,
                isStartRecording:false,

                remain:10,
                time:null,

                regcb:false
            }
        },
        methods: {
            ...mapMutations(['setRecordId']),
            setIsPlaying(isPlaying){
                this.isPlaying = isPlaying
            },
            setIsPlayingRecord(isPlayingRecord){
                this.isPlayingRecord = isPlayingRecord
            },
            setIsStartRecording(isStartRecording){
                this.isStartRecording = isStartRecording
            },

            handleSwitchTabItem(item) {
                if (item.key !== this.selected) {
                    this.selected = item.key
                }
            },
            handleMusicClick(item) {
                // console.log('you press' , item.key)
                this.hadPressedMusicButton = true
                if(!this.isPlaying){
                    const audio = this.$refs[`${this.selected}_${item.key}`]
                    if(audio){
                        this.setIsPlaying(audio)
                        console.log('music playing')
                        audio.play()
                    }else{
                        console.error('music doesnot exist')
                    }

                }else{
                    // console.log('正在播放音乐')
                }
            },
            handleStartRecord(){
                try{
                    if(this.isStartRecording){
                        //已经开始录音
                        this.stopRecord()
                    }else{
                        //开始录音
                        if(this.isPlaying){
                            this.stopaudio(this.isPlaying)
                            this.startRecord()
                        }else{
                            this.startRecord()
                        }

                    }
                    console.log('start recode')
                }catch (e) {
                    console.error('start record' , e)
                }

            },
            timeCount(){
                this.remain--
                if(this.remain <= 0){
                    this.stopRecord()
                }
            },
            startRecord(){
                //reset time
                startRecord().then(()=>{
                    this.remain = 10
                    //delete pre record id
                    this.setRecordId(null)
                    this.setIsStartRecording(true)
                    this.hadPressedMusicButton = false
                    startRecord()
                    this.time = setInterval(this.timeCount , 1000)
                }).catch(err=>{
                    console.error('start record error' , err)
                })

            },
            stopRecord(){
                clearInterval(this.time)
                this.time = null
                this.setIsStartRecording(false)
                stopRecord().then(recordId => {
                    if(this.hadPressedMusicButton){
                        this.setRecordId(recordId)
                        this.hadPressedMusicButton = false
                        console.log('save recrod id , completed record')
                    }else{
                        console.log('had no tap music button')
                    }

                }).catch(err =>{
                    console.error('record fail' ,err)
                })
            },
            handlePlayRecord(){

                if(!this.regcb){
                    //是否 register 了，录音播放完毕event
                    this.regcb = true
                    registerOnVoicePlayEnd(recordId=>{
                        //录音播放完毕
                        this.setIsPlayingRecord(false)
                    })
                }
                if(this.isPlayingRecord){
                    stopPlayRecord(this.recordId)
                    this.setIsPlayingRecord(false)
                    console.log('stop play recode')
                }else{
                    if(this.isPlaying){

                        this.stopaudio(this.isPlaying)
                        playRecord(this.recordId)
                        this.setIsPlayingRecord(true)
                        console.log('start play recode')
                        // this.isPlaying.stop().then(()=>{
                        //     playRecord(this.recordId)
                        //     this.setIsPlayingRecord(true)
                        //     console.log('start play recode')
                        // }).catch(err=>console.error('stop error' , err))
                    }else{
                        playRecord(this.recordId)
                        this.setIsPlayingRecord(true)
                        console.log('start play recode')
                    }
                }

            },
            handleSaveRecord(){
                console.log('save recode')
            },
            handleGotoMusicPage(){
                if(!!this.recordId){
                    this.$router.push({name:'individuality'})
                }

            },
            audioend(item){
                console.log('end music' , item)
                this.setIsPlaying(null)
            },
            stopaudio(audio){
                audio.pause();
                audio.currentTime = 0;
                this.setIsPlaying(null)
            }
        },
        mounted(){
            const data = {}
            wxRecordConfig(data)
        },
        beforeRouteEnter (to, from, next) {
            // called before the route that renders this component is confirmed.
            // does NOT have access to `this` component instance,
            // because it has not been created yet when this guard is called!
            next()
        },
        beforeRouteUpdate (to, from, next) {
            // called when the route that renders this component has changed,
            // but this component is reused in the new route.
            // For example, for a route with dynamic params `/foo/:id`, when we
            // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
            // will be reused, and this hook will be called when that happens.
            // has access to `this` component instance.
            next()
        },
        beforeRouteLeave (to, from, next) {
            // called when the route that renders this component is about to
            // be navigated away from.
            // has access to `this` component instance.
            if(this.isStartRecording){
                console.log("beforeRouteLeave close record")
                stopRecord().then(recordId => {
                    if(this.isPlaying){
                        console.log("beforeRouteLeave close music")
                        this.isPlaying = null
                        return this.stopaudio(this.isPlaying)
                    }
                }).finally(()=>{
                    clearInterval(this.time)
                    this.time = null
                    next()
                })
            }else{
                clearInterval(this.time)
                this.time = null
                next()
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/mixin";
    $radius: 5px;

    .page{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: transparent;
    }
    .nav-bar {
        display: flex;
        height: 38px;

        .nav-bar-item {
            display: flex;
            justify-content: center;
            align-items: center;

            border: 1px solid;
            border-top-left-radius: 2px;
            border-radius: $radius $radius 0 0;
            flex: 1;

            &.selected {
                border-bottom: none;

            }
        }
    }

    .btn-size{
        @include font-dpr($base-btn-font-size);
    }
    .body{
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        flex:1;
        .music-wrap{
            align-self: stretch;
        }

        .record_btn{
            margin-top: 67px;
        }

        .img{
            height: 73px;
            width: 322px;
            position: absolute;
            left:50%;
            transform: translateX(-50%);
            /*bottom:  33.1%;*/
            bottom:  26.3%;
        }

        .btn-group{
            position: absolute;
            /*bottom:  24.5%;*/
            bottom:  17.6%;
            display: flex;
            flex-direction: row;
            width: 100%;

            .btn {
                margin-top: 0 !important;
                width: 123px;
            }
        }

        .link_btn{
            position: absolute;
            /*bottom: 67px;*/
            width: 149px;
            bottom: 22px;
            left:50%;
            transform: translateX(-50%);
        }

        .footer{
            position: absolute;
            bottom:0;
            /*.img{*/
                /*margin-top: 56px;*/
                /*height: 73px;*/
                /*width: 322px;*/
            /*}*/

            /*.btn-group{*/

            /*}*/

            /*.link_btn{*/

            /*}*/
        }

    }






    $padding: 30px;
    $gutter: 0px;
    .row1{
        margin-top: 26px;
    }
    .row2{
        margin-top: 35px;
    }
    .row {
        box-sizing: content-box;
        padding: 0 30px;

        &:before, &:after {
            content: " ";
            display: table;
        }

        &:after {
            clear: both;
        }


        & [class^="row-col-"] {
            float: left;
        }

        .row-col-4 {
            width: 25%;
            display: inline-block;

        }

        .center{
            text-align: center;
        }
    }
</style>
