<template>
    <div  class="btn-img disable-select" :class="[`btn${index + 1}`]"  @touchstart="handleStart"
          @touchend="handleEnd"
    >
        <!--<img src="chat-wrap.png" class="img"/>-->
        <div class="btn-text">
            {{text}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "MusicButtonEx",
        props: {
            text: {
                type: String,
                default: ''
            },
            index:{
                type:Number,
                default:0
            }
        },
        data() {
            return {
                pressing: false,
                time:null
            }
        },
        methods: {
            handleStart() {
                this.pressing = true
                this.$emit('touchedButton')
                this.time = setInterval(()=>{
                    console.log('开始按钮')
                    this.$emit('touchedButton')
                } , 500)

                console.log('开始按钮')
            },
            handleEnd(){
                this.pressing = false
                clearInterval(this.time)
                this.time = null
                console.log('结束按钮')
            }
        },
        mounted(){
            document.body.addEventListener('touchend' , this.handleEnd)
        },
        beforeDestroy(){
            clearInterval(this.time)
            this.time = null
            document.body.removeEventListener('touchend' , this.handleEnd)
            // console.log('beforeDestroy press')
        }
    }
</script>

<style scoped>
    .btn-img {
        position: absolute;
        width: 50px;
        height: 7.63%;
        background-repeat: no-repeat;
        background-image: url("./chat-wrap.png");
        background-size: contain;
        /*background-color: fuchsia;*/
        /*padding: 8px 4px 9px 3px;*/
        /*box-sizing: border-box; /*padding: 8px 4px 9px 3px;*/
        /*box-sizing: border-box;*/
        display: flex;
        justify-content: center;
        background-color: transparent;
    }
    .img{
        /*position: absolute;*/
        /*left:0;*/
        /*top:0;*/
        /*bottom: 0;*/
        /*right: 0;*/
        width: 100%;
        height: 100%;
    }
    .btn-text {

        height: 69.23%;
        width: 83.67%;
        position: absolute;

        top:15.34%;
        bottom:17.31%;
        left:50%;
        transform: translateX(-50%);


        z-index: 1;
        /*width: 43px;*/
        /*height: 5.24%;*/
        /*background-color: white;*/
        color: lightseagreen;
        font-family: Music-font;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        text-align: center;
        /*position: absolute;*/

    }
    .btn1 {
        top: 44.46%;
        left: 80px;
    }

    .btn2 {
        top: 44.46%;
        left: 135px;
    }

    .btn3 {
        top: 44.46%;
        left: 190px;
    }

    .btn4 {
        top: 44.46%;
        left: 245px;
    }

    .btn5 {
        top: 52.99%;
        left: 80px;
    }

    .btn6 {
        top: 52.99%;
        left: 135px;
    }

    .btn7 {
        top: 52.99%;
        left: 190px;
    }

    .btn8 {
        top: 52.99%;
        left: 245px;
    }



    .text1 {
        top: 45.36%;
        left: 84px;
    }

    .text2 {
        top: 45.36%;
        left: 139px;
    }

    .text3 {
        top: 45.36%;
        left: 194px;
    }

    .text4 {
        top: 45.36%;
        left: 249px;
    }

    .text5 {
        top: 53.74%;
        left: 84px;
    }

    .text6 {
        top: 53.74%;
        left: 139px;
    }

    .text7 {
        top: 53.74%;
        left: 194px;
    }

    .text8 {
        top: 53.74%;
        left: 249px;
    }
</style>
