<template>
    <div class="wrap">

        <div class="tap" @click="handleTap">

        </div>
        <canvas id="canvas" class="canvas">

        </canvas>
        <button @click="handleStop">
            跳过
        </button>

        <video id="video"
               class="video"
               :src="video"
               preload="auto"
               playsinline="true"
               webkit-playsinline="true"
               @play="handlePlay"
               @ended="handleEnd"
               style="display: none"
               width="1" height="1"></video>


        <!--<video id="video"-->
               <!--class="video"-->
               <!--:src="video"-->
               <!--autoplay-->
               <!--preload="auto"-->
               <!--style="object-fit:fill"-->
               <!--x5-video-player-fullscreen="true"-->
               <!--x5-video-orientation="portrait"-->
               <!--x5-video-player-type="h5"-->
               <!--webkit-playsinline="true"-->
               <!--playsinline-->
               <!--x-webkit-airplay="allow"-->
               <!--@play="handlePlay"-->
               <!--@ended="handleEnd"-->
        <!--&gt;-->

        <!--</video>-->
    </div>

</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import jquery from 'jquery'
    import videojs from 'video.js'
    export default {
        name: "video-",
        computed: {
            ...mapGetters(['base', 'showVideo']),
            video() {
                return `${this.base}video.mp4`
            }
        },
        data() {
            return {
                showCanvas: false,
                isAndroid: true
            }
        },
        methods: {
            gotoSignInURL() {

                // console.log('gotoSignInURL')
                // return

                window.location.href = 'http://bsxyzqy.ysmine.com/login/api/login/htmllogin'
            },
            ...mapMutations(['setShowVideo']),
            handleEnd() {
                console.log('handleEnd')
                this.gotoSignInURL()
            },
            handleStop() {
                var video = document.getElementById('video');
                console.log('handleStop')
                video.pause();
                video.currentTime = 0;

                this.gotoSignInURL()
            },
            handleTap(){
                var video = document.getElementById('video');
                video.play().catch(err=>console.log(err))
            },
            handlePlay() {
                console.log('handlePlay')
                var video = document.getElementById('video');
                var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext('2d');
                var $this = video;
                var w = window,
                    d = document,
                    e = d.documentElement,
                    g = d.getElementsByTagName('body')[0],
                    x = w.innerWidth || e.clientWidth || g.clientWidth,
                    y = w.innerHeight || e.clientHeight || g.clientHeight;

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                jquery(video).hide()
                (function loop() {
                    // console.log('loop')
                    console.log(x, y)
                    if (!$this.paused && !$this.ended) {
                        ctx.drawImage($this, 0, 0, x, y);
                        setTimeout(loop, 1000 / 30); // drawing at 30fps
                    }
                })();
            },
            handlePlayVideo() {
                if (this.isAndroid) {

                    alert('start play')
                    document.getElementById('video').play();
                }
            }
        },
        mounted() {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

            this.isAndroid = isAndroid

            console.log('hopme locaiton' , window.location.href)
            if (isIOS) {
                document.addEventListener("WeixinJSBridgeReady", function (e) {
                    console.log('start play')
                    const video = document.getElementById('video')
                    video.play();
                }, false);
            } else {

                // this.$router.push({name:'home'})
                // return
                // this.gotoSignInURL()
                // video.addEventListener('timeupdate', function (e) {
                //     console.log('timeupdate' , e)
                // })
                // video.addEventListener('x5videoenterfullscreen', function (e) {
                //     console.log('x5videoenterfullscreen' , e)
                // })
                // video.addEventListener('x5videoexitfullscreen', function (e) {
                //     console.log('x5videoexitfullscreen' , e)
                // })
            }


        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .tap{
        width: 20%;
        height: 20%;
        position: absolute;
        z-index: 100;
        background-color: yellow;
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
        left: 50%;
        top: 50%;
        width: 10px;
        height: 10px;
        border: 1px solid green;
    }

    .video {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        border: 1px solid yellow;
    }
</style>