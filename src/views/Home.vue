<template>
    <div class="container">
        <img :src="bg" class="img"/>
        <div class="how-to-play" @click="handleShowPlay"/>
        <div class="start-my-music-journey" @click="handlePushPage"/>
        <how-to-play-dialog :visible.sync="showHowtoplay"/>
        <video  class="video-cs" id="video"  v-if="showVideo" ref="video" autoplay="autoplay"
                width="400" height="400"
               @ended="videoEnded">
            <!--<source src="http://pn3yoa4tm.bkt.clouddn.com/asserts/image/pages/video/video.mp4" type="video/mp4">-->
            <source src="./video2.mp4" type="video/mp4">
        </video>
        <button @click="handleSkip" class="skip-button">
            跳过
        </button>
    </div>

</template>

<script>
    import HButton from "../components/HButton";
    import HowToPlayDialog from "../components/Dialog/HowToPlayDialog";
    import {getSignInfo} from "../utils/http";
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
            if(this.showVideo){


            }
            this.init()
        },
        methods: {
            ...mapMutations(['setShowVideo']),
            videoEnded(){
                // this.setShowVideo(false)
                console.log('videoEnded')
            },
            handleSkip(){

                try {
                    const video = document.getElementById("video");
                    if(video){
                        console.log(video)
                    }
                    video.play().catch(e=>console.log('err' , e))
                    console.log('play video')
                }catch (e) {
                    console.log(e)
                }

                // return
                // const video = document.getElementById("video");
                // video.pause()
                // this.setShowVideo(false)
            },
            async init() {
                try {
                    const {
                        appid,
                        noncestr,
                        signature,
                        timestamp
                    } = await getSignInfo(window.location.href)

                    // console.log(res)
                } catch (e) {
                    console.log('error ', e)
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

    .video-cs{
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
    }

</style>
