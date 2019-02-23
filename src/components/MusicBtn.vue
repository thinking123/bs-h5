<template>
    <div class="music-btn"
         @touchstart="touchstart"
         @touchend="touchend">
        {{text}}
    </div>

</template>

<script>
    export default {
        name: "MusicBtn",
        props: {
            text: String,
            musicKey: String,
        },
        methods: {
            touchstart(e) {

                // this.setData({
                //     pressing: true
                // })
                this.pressing = true
                this.$emit('touching', this.musicKey)
                this.time = setInterval(() => {
                    // console.log('开始按钮')
                    this.$emit('touching', this.musicKey)
                }, 300)

                // console.log('开始按钮')


            },
            touchend(e) {


                // this.setData({
                //     pressing: false
                // })
                this.pressing = false
                clearInterval(this.time)
                this.time = null
                // console.log('结束按钮')
            }
        },
        beforeDestroy(){
            clearInterval(this.time)
        }

    }
</script>

<style scoped>
    .music-btn {
        /*user-select: none;*/
        /*z-index: 100;*/
        position: absolute;
        /*height: 7.8%;*/
        width: 96px;
        /*background-image: url("./btn-wrap.png");*/
        /*background-size: 100% 100%;*/
        /*background-repeat: no-repeat;*/
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        color: #0094FF;
        font-size: 50px;
    }
</style>
