<template>
    <div id="content">
        <div id="m"  class="gridBox" ></div>
        <div id="2"  class="gridBox"></div>
        <div id="3"  class="gridBox"></div>
        <div id="4"  class="gridBox"></div>
        <div id="5"  class="gridBox"></div>
        <div id="6"  class="gridBox"></div>
        <div id="7"  class="gridBox"></div>
        <div id="8"  class="gridBox"></div>
        <div id="9"  class="gridBox"></div>
        <div id="10"  class="gridBox"></div>
        <div id="11"  class="gridBox"></div>
        <div id="12"  class="gridBox"></div>
    </div>
</template>

<script>
    let preload;
    export default {
        name: "MusicTest",
        mounted(){
            this.init()
            document.addEventListener('click' , this.playSound)
        },
        methods: {
            init() {
                if (!createjs.Sound.initializeDefaultPlugins()) {
                    document.getElementById("error").style.display = "block";
                    document.getElementById("content").style.display = "none";
                    console.log('init error')
                    return;
                }
                //examples.showDistractor("content");
                // var assetsPath = "https://www.createjs.com/demos/_assets/audio/";
                var assetsPath = "./";
                var sounds = [
                    {src: "Game-Break.ogg", id: 'og'},
                    {src: "Game-Break.ogg", id: 2},
                    {src: "Game-Break.ogg", id: 3},
                    {src: "Game-Break.ogg", id: 4},
                    {src: "Game-Break.ogg", id: 5},
                    {src: "Game-Break.ogg", id: 6},
                    {src: "Game-Break.ogg", id: 7},
                    {src: "Game-Break.ogg", id: 8},
                    {src: "Game-Break.ogg", id: 9},
                    {src: "Game-Break.ogg", id: 10},
                    {src: "Game-Break.ogg", id: 11},
                    {src: "Game-Break.ogg", id: 12}  //OJR would prefer a new sound rather than a copy
                ];
                createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
                // createjs.Sound.addEventListener("fileload", createjs.proxy(soundLoaded, this)); // add an event listener for when load is completed
                createjs.Sound.registerSounds(sounds, assetsPath);
            },
            soundLoaded(event) {
                //examples.hideDistractor();
                alert('loaded')
                // var div = document.getElementById(event.id);
                // div.style.backgroundImage = "url('../_assets/art/audioButtonSheet.png')";
            }, 
            stop() {
                if (preload != null) {
                    preload.close();
                }
                createjs.Sound.stop();
            },
            playSound(e) {
                let target = e.target
                //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
                console.log('play')
                var instance = createjs.Sound.play('og');
                if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
                    console.log('play return' ,instance)
                    return;
                }
                // target.className = "gridBox active";
                // instance.addEventListener("complete", function (instance) {
                //     target.className = "gridBox";
                // });
            }
        }
    }
</script>

<style scoped lang="scss">
#content{
    >div{
        width: 100px;
        height: 100px;
        /*border:2px solid yellow;*/
        background: yellow;

    }
    &:nth-child(odd){
        width: 100px;
        height: 100px;
        background: green;
    }
}
</style>