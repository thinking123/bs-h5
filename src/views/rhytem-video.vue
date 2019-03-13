<template>
    <div class="wrap">

        <!--<div class="tap" @click="handleTap">-->

        <!--</div>-->
        <canvas id="canvas" class="canvas" v-if="isIOS">

        </canvas>
        <button @click="handleStop" class="button">
            跳过
        </button>
        <div class="control-wrap"  v-if="!isPlaying && isAndroid"   id="control">
            <!--开始播放-->
            <img :src="bg"/>
            <div class="bg-btn-wrap" @click="handleStart" >
                <img :src="bgBtn" class="bg-btn"/>
            </div>

        </div>
        <div   class="video-wrap">
            <video id="video"
                    class="video"
                   :class="{'hidden-video':isIOS}"
                   src="https://cdnpepsi.ysmine.com/video.mp4"
                   webkit-playsinline="true"
                   playsinline
                   x-webkit-airplay="allow"

                   x5-video-player-fullscreen="true"
                   x5-video-orientation="portrait"
                   x5-video-player-type="h5"

                   width="100"
                   height="100"
                   @play="handlePlay"
                   @ended="handleEnd"></video>
        </div>



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
    // import $ from 'jquery'
    // import videojs from 'video.js'
    export default {
        name: "video-",
        computed: {
            ...mapGetters(['base']),
            video() {
                return `${this.base}video.mp4`
            },
            bg() {
                return `${this.base}video-bg.png`
            },
            bgBtn() {
                return `${this.base}video-thumb.png`
            }
        },
        data() {
            return {
                isAndroid: true,
                showControl:true,
                isPlaying:false,
                isIOS:false
            }
        },
        methods: {
            gotoSignInURL() {
                window.location.replace('http://bsxyzqy.ysmine.com/login/api/login/htmllogin')
                // window.location.href = 'http://bsxyzqy.ysmine.com/login/api/login/htmllogin'
            },
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
            handlePlay() {

                if( this.isAndroid){
                    console.log('handlePlay isAndroid')
                    const video = document.getElementById('video')
                    video.style.width = window.innerWidth +  "px";
                    video.style.height = window.innerHeight + "px";
                    this.isPlaying = true
                    return
                }else{
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
                    // jquery(video).hide()
                    (function loop() {
                        // console.log('loop')
                        console.log(x, y)
                        if (!$this.paused && !$this.ended) {
                            ctx.drawImage($this, 0, 0, x, y);
                            setTimeout(loop, 1000 / 30); // drawing at 30fps
                        }
                    })();
                }


            },
            handleStart(){
                const video = document.getElementById('video')


                video.play().catch(err=>{
                    console.log('play err' , err)
                });

                console.log('handleStart')
            }
        },
        created(){
            const u = navigator.userAgent;
            const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

            this.isAndroid = isAndroid
            this.isIOS = isIOS

            console.log('isAndroid' , isAndroid)
            console.log('isIOS' , isIOS)
            // if(isAndroid)
            // alert('isAndroid')
            //
            // if(isIOS)
            //     alert('isIOS')
            if (isIOS) {
                document.addEventListener("WeixinJSBridgeReady", function (e) {
                    console.log('start play')
                    const video = document.getElementById('video')
                    video.play();
                }, false);
            }
            if(isAndroid){


                document.addEventListener("WeixinJSBridgeReady", function (e) {
                    // alert('WeixinJSBridgeReady')
                    const video = document.getElementById('video')
                    video.addEventListener("x5videoenterfullscreen", function(){
                        // alert('enterfullscreen')
                        console.log('player enterfullscreen')
                    })

                    video.addEventListener("x5videoexitfullscreen", function(){
                        console.log('player x5videoexitfullscreen')
                        this.gotoSignInURL()
                    })

                    window.onresize = function(){
                        // alert('resize')
                        const video = document.getElementById('video')
                        video.style.width = window.innerWidth +  "px";
                        video.style.height = window.innerHeight + "px";
                    }

                }, false);
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
        top: 132px;
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
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        /*border: 1px solid green;*/
    }

    .control-wrap{
        position: absolute;
        width: 100%;
        height: 100%;
        /*border: 10px solid gold;*/
        background-color: green;

    }

    .control-wrap > img{
        width: 100%;
        height: 100%;
    }
    .video{
        /*object-fit: fill;*/
    }

    .hidden-video{
        display: none;
    }
    .video-wrap{
        /*border: 5px solid red;*/

    }
    .title-bar{
        position: fixed;
        width: 100%;
        height: 100px;
        background-color: sandybrown;
        z-index: 10000;
    }

    .bg-btn-wrap{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 1000;
        display: flex;
        align-items: center;

        justify-content: center;
    }
    .bg-btn{
        width: 128rpx;
        height: 128rpx;
    }
    /*.video {*/
        /*position: absolute;*/
        /*left: 0;*/
        /*top: 0;*/
        /*opacity: 0;*/
        /*width: 100%;*/
        /*height: 100%;*/
        /*object-fit: contain;*/
        /*border: 10px solid yellow;*/
    /*}*/
</style>