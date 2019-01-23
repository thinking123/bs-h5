<template>
    <button class="btn disable-select" @touchstart.self="handleStart"
    @touchend="handleEnd" :class="{'pressing':pressing}"
    >
        <slot/>
    </button>
</template>

<script>
    export default {
        name: "MusicButton",
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

<style scoped lang="scss">
    $btn-size: 57px;
    .btn {
        width: $btn-size;
        height: $btn-size;
        border-radius: $btn-size;
        font-size: $music-btn-font-size;
        border: none;
        &.pressing{

        }

        &:active{
            background-color: #04BE02;
            color:white;
        }
    }


</style>
