<template>
    <div class="page">
        <img src="./bg.png" class="bg-img"/>
        <img src="./playing.png" class="play-music" v-if="isPlaying" @click="handlePlay"/>
        <img src="./play.png" class="play-music" v-else @click="handlePlay"/>
        <div   class="share"/>
        <div   class="register"/>
        <share-music-playing-bar class="share-bar" v-if="isPlaying"/>
        <!--<h-button @click="handleShare" class="btn">-->
            <!--分享-->
        <!--</h-button>-->
    </div>
</template>

<script>
    import HButton from "../../components/HButton";
    import ShareMusicPlayingBar from "../../components/ShareMusicPlayingBar";
    export default {
        name: "MusicIndividuality",
        components: {ShareMusicPlayingBar, HButton},
        methods: {
            handleShare() {
                console.log('share')
            },
            handlePlay(){
                this.isPlaying = !this.isPlaying
            }
        },
        data() {
            return {
                isPlaying: false
            }
        },

    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/mixin";


    .bg-img{
        height: 100%;
        width: 100%;
        position: absolute;
        left:0;
        right: 0;
        top:0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }



    .play-music{
        position: absolute;
        top:138px;
        right:0px;
        height: 32px;
        width: 72px;

    }

    .share{
        position: absolute;
        top:512px;
        height: 39px;
        width: 137px;
        left:50%;
        transform: translateX(-50%);
    }

    .register{
        position: absolute;
        top:565px;
        height: 39px;
        width: 137px;
        left:50%;
        transform: translateX(-50%);
    }


    .page{
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        .img{
            margin-top: 85px - $wxTitleBar;
            width: 300px;
            height: 63.7%;
        }

        .btn{
            position: absolute;
            bottom: 24px;
            left:50%;
            transform: translateX(-50%);

            @include font-dpr($base-btn-font-size);
        }
    }
    .share-bar{
        /*left:335px;*/
        right: 0;
        top:145px;
        position: absolute;
        margin-right: 2px;
    }
</style>
