<template>
    <div class="wrap">

        <button @click="handlePlay">
            play
        </button>
        <video id="video" :src="video"
               x5-video-orientation="portrait"
               preload="auto"
               playsinline="true"
               webkit-playsinline="true"
               x-webkit-airplay="true"
               x5-video-player-fullscreen="true"
               x5-video-player-type="h5"
               width="1"
               height="1">

        </video>
    </div>

</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    // import jquery from 'jquery'
    // import videojs from 'video.js'
    export default {
        name: "rhytem-video",
        computed: {
            ...mapGetters(['base', 'showVideo']),
            video() {
                return `${this.base}video.mp4`
            }
        },
        data() {
            return {
                showCanvas: false,
                isAndroid:true
            }
        },
        methods: {

            handleEnd() {
                console.log('handleEnd')
            },
            handleStop() {

            },
            handlePlay() {
               const v = document.getElementById('video')
                if(!v){
                    console.log('vidoe不存在')
                }

                v.play()
            },
        },
        mounted() {



        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
        position: relative;
    }

    button {
        z-index: 10000;
        position: fixed;
        top: 32px;
        right: 32px;
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

    .canvas {
        position: absolute;
        left: 0%;
        top: 0%;
        width: 100%;
        height: 100%;
        border: 1px solid red;
    }

    .video {
        position: absolute;
        left: 0;
        top: 0;
        /*opacity: 0;*/
        width: 100%;
        height: 100%;
        object-fit: contain;
        border: 1px solid yellow;
    }
</style>