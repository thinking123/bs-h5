<template>
    <div class="container">
        <audio ref="do" >
            <source src="https://cdnpepsi.ysmine.com/rhythm-select-do.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="re" >
            <source src="https://cdnpepsi.ysmine.com/rhythm-select-re.mp3" type="audio/mpeg"/>
        </audio>

        <audio ref="mi" >
            <source src="https://cdnpepsi.ysmine.com/rhythm-select-mi.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="fa" >
            <source src="https://cdnpepsi.ysmine.com/rhythm-select-fa.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="sol" >
            <source src="https://cdnpepsi.ysmine.com/rhythm-select-sol.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="la" >
            <source src="https://cdnpepsi.ysmine.com/rhythm-select-la.mp3" type="audio/mpeg"/>
        </audio>
        <audio ref="xi" >
            <source src="https://cdnpepsi.ysmine.com/rhythm-select-xi.mp3" type="audio/mpeg"/>
        </audio>
        
        <div class="content" >
            <img :src="bg" class="img"/>
            <div class="how-to-play" @click="handleShowPlay"/>
            <div class="start-my-music-journey"
                 @click="handlePushPage" />
            <how-to-play-dialog :visible.sync="showHowtoplay"/>

        </div>
    </div>
</template>

<script>
    import HButton from "../components/HButton";

    import {CHANGE_LOADING_BAR} from "../store/mutations";
    import HowToPlayDialog from "../components/Dialog/HowToPlayDialog";
    import {getSignInfo , login} from "../utils/http";
    import {getOS} from "../utils/common";
    import {mapGetters , mapMutations} from 'vuex'
    import music from '../utils/MusicPlay'
    const baseAudioUrl = `asserts/audio/video/video.mp4`
    const page = 'music-journey-'
    export default {
        name: "Home",
        components: {HowToPlayDialog, HButton},
        computed: {
            ...mapGetters(['base' , 'showVideo' , 'openid','headimgurl' , 'nickname' ,]),
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

            const that = this
            document.addEventListener("WeixinJSBridgeReady", function (e) {
                console.log('WeixinJSBridgeReady init')


                // that.init()
            }, false);
            document.addEventListener("WeixinJSBridgeReady", function (e) {

            })
            // that.$sound.load()

            // const [and , ios] = getOS()
            // if(and){
            //     that.$sound.load()
            // }
            // if(ios){
            //     that.init()
            // }
        },
        methods: {
            ...mapMutations([CHANGE_LOADING_BAR, 'setLoadingText']),
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
            async init() {
                try {
                    console.log('headimgurl' , this.headimgurl)
                    this.CHANGE_LOADING_BAR(true)
                    await this.$music.init()
                } catch (e) {
                    console.log('login error ', e)
                }finally {
                    this.CHANGE_LOADING_BAR(false)
                }
            },
            touchstart(){
                // createjs.HTMLAudioPlugin.playEmptySound();
            },
            handlePushPage() {

                // createjs.WebAudioPlugin.playEmptySound();
                this.$router.replace({name: 'select'})
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
