<template>
    <div class="container">

        <!--<video-->
                <!--src="./video.mp4"-->
                <!--x-webkit-airplay='true'-->
                <!--x5-video-player-type='h5'-->
                <!--x5-video-player-fullscreen='true'-->
                <!--x5-video-orientation="portraint"-->
                <!--style="object-fit:fill"-->
                <!--id="video"-->
                <!--preload="auto"-->
                <!--width="500" height="500"-->
                <!--autoplay>-->
            <!--不支持播放视频-->
        <!--</video>-->


        <!--<div   v-if="showVideo" class="video-container">-->
      <!---->
        <!--</div>-->


        <!--<button @click="handleSkip" class="skip-button"  v-if="showVideo">-->
            <!--跳过-->
        <!--</button>-->
        <div class="content" >
            <img :src="bg" class="img"/>
            <div class="how-to-play" @click="handleShowPlay"/>
            <div class="start-my-music-journey" @click="handlePushPage"/>
            <how-to-play-dialog :visible.sync="showHowtoplay"/>

        </div>


    </div>

</template>

<script>
    import HButton from "../components/HButton";
    import HowToPlayDialog from "../components/Dialog/HowToPlayDialog";
    import {getSignInfo , login} from "../utils/http";
    import {mapGetters , mapMutations} from 'vuex'
    const baseAudioUrl = `asserts/audio/video/video.mp4`
    const page = 'music-journey-'
    export default {
        name: "Home",
        components: {HowToPlayDialog, HButton},
        computed: {
            ...mapGetters(['base' , 'showVideo']),
            bg() {
                return `${this.base}${page}bg.png`
            },
            videoSrc() {
                return `${this.base}${baseAudioUrl}`
            }
        },
        data() {
            return {
                showHowtoplay: false
            }
        },

        mounted() {
            console.log('href' , window.location.href)
            this.init()
            
            // this.initVideo()
        },
        methods: {
            initVideo(){
                
                const v = this.$refs.video
                
                video.attr('x5-video-player-type', 'h5');
                video.attr('x-webkit-airplay', true);
                video.attr('x5-video-player-fullscreen', true);
                video.attr('x5-video-ignore-metadata', true);
                video.attr('object-fit', 'fill');
                video.attr('object-position', 'center center');
            },
            ...mapMutations(['setShowVideo']),
            videoEnded(){
                this.setShowVideo(false)
                // alert()
                console.log('videoEnded')
            },
            videoStop(){

            },
            async handleSkip(){

                try {
                    const video = document.getElementById("video");
                    if(video){
                        console.log(video)
                        await video.pause()
                    }

                }catch (e) {
                    console.log(e)
                }finally {
                    this.setShowVideo(false)
                }

                // return
                // const video = document.getElementById("video");
                // video.pause()
                // this.setShowVideo(false)
            },
            async init() {
                try {

                    const res = await login()
                    console.log('login' , res)
                } catch (e) {
                    console.log('login error ', e)
                }
            },
            handlePushPage() {
                this.$router.push({name: 'interact'})
            },
            handleShowPlay() {
                this.showHowtoplay = true
                console.log("show how to play")
            },
            handleChange() {
                console.log('handleChange')
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/mixin";

    /*page{*/
    /*height: 100%;*/
    /*width: 100%;*/
    /*}*/

    .video-container{
        position: fixed;
        height: 100%;
        width: 100%;
    }
    .play-video{

        height: 100%;
        width: 100%;
    }
    .video-cs{
        z-index: 100;
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }
    .container {
        height: 100%;
        width: 100%;
        position: relative;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    .content{
        height: 100%;
        width: 100%;
        position: relative;
    }
    .img {
        height: 100%;
        width: 100%;
    }

    .how-to-play {
        position: absolute;
        top: 2.4%;
        left: 676px;
        height: 14.09%;
        width: 64px;
        /*border: 1px solid yellow;*/
    }

    .start-my-music-journey {
        position: absolute;
        top: 75.41%;
        left: 50%;
        transform: translateX(-50%);
        height: 9.3%;
        width: 476px;
        /*border: 1px solid yellow;*/
    }

    .skip-button{
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
        background-color: white;
    }

</style>
