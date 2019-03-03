<template>
    <div class="wrap">

        <canvas id="canvas"style="width: 100%;height: 100%;position: absolute;left:0;right: 0;top:0;bottom: 0;">

        </canvas>
        <button @click="handleStop">
            跳过
        </button>
        <video id="video" class="video"
               autoplay
               :src="video"
               x-webkit-airplay=”true”
               playsinline webkit-playsinline="true"
               @play="handlePlay"
               @ended="handleEnd"
               preload="auto" style="display: none;">

        </video>
    </div>

</template>

<script>
    import {mapGetters , mapMutations} from 'vuex'
    export default {
        name: "rhytem-video",
        computed: {
            ...mapGetters(['base' , 'showVideo']),
            video() {
                return `${this.base}video.mp4`
            }
        },
        methods:{
            gotoSignInURL(){
              // window.location.href = 'http://bsxyzqy.ysmine.com/login/api/login/htmllogin'


              window.location.href = 'http://localhost:8080/?openid=oGJAbuG4O80vlLPhTdD6ctBPTp9Q&nickname=52533&sex=1&headimgurl=http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJR4VRqBhPeQqDvsUX0V5mBlCR72VqWQFQTkNBR0y7F3g71kNsYCIo1055M0ctbVtVUlaia7GUeib5g/132'


                // http://bsxyzqy.ysmine.com/?openid=oGJAbuG4O80vlLPhTdD6ctBPTp9Q&nickname=52533&sex=1&headimgurl=http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJR4VRqBhPeQqDvsUX0V5mBlCR72VqWQFQTkNBR0y7F3g71kNsYCIo1055M0ctbVtVUlaia7GUeib5g/132#/video
            },
            ...mapMutations(['setShowVideo']),
            handleEnd(){
              console.log('handleEnd')
                // this.setShowVideo(false)
                // this.$router.replace({name:'home'})
                this.gotoSignInURL()
            },
            handleStop(){
                var video = document.getElementById('video');
              console.log('handleStop')
                video.pause();
                video.currentTime = 0;
                // this.setShowVideo(false)
                // this.$router.replace({name:'home'})

                this.gotoSignInURL()
            },
            handlePlay(){
                var video = document.getElementById('video');
                var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext('2d');
                var $this = video; //cache
                // canvas.attr("width", $(window).get(0).innerWidth);
                //
                // canvas.attr("height", $(window).get(0).innerHeight);

                var w = window,
                    d = document,
                    e = d.documentElement,
                    g = d.getElementsByTagName('body')[0],
                    x = w.innerWidth || e.clientWidth || g.clientWidth,
                    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                // canvas.style.width = x + 'px'
                // canvas.style.height = y + 'px'
                    (function loop() {
                    // console.log('loop')
                    console.log(x , y)
                    if (!$this.paused && !$this.ended) {
                        ctx.drawImage($this, 0, 0 , x , y);
                        setTimeout(loop, 1000 / 30); // drawing at 30fps
                    }
                })();
            }
        },
        mounted() {
            document.addEventListener("WeixinJSBridgeReady", function() {
                // console.log('WeixinJSBridgeReady play')
                document.getElementById('video').play();
            }, false);
        }
    }
</script>

<style scoped>
    .wrap{
        width: 100%;
        height: 100%;
        position: relative;
    }
    button{
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
    .video {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>