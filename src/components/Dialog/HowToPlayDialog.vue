<template>
    <div class="dialog"  v-if="showDialog" @click.stop="handleStop">
        <div class="mask" id="mask"/>
        <div class="body" @click.self="handleDialogClick">
            <img src="../../assets/img/how-to-play-bg.png" class="content" />
            <img src="../../assets/img/how-to-play-return.png" class="return-btn"
                 @click="handleReturn"
            />
        </div>
    </div>
</template>

<script>
    export default {
        name: "HowToPlayDialog",
        props:{
            visible:{
                type:Boolean,
                default:false
            }
        },
        methods: {
            handleStop(e){

            },
            handleDialogClick(e) {
                console.log(e)
                this.showDialog = false
            },
            handleReturn(){
                this.showDialog = false
            }
        },
        computed:{
            showDialog: {
                set(v) {
                    this.$emit('update:visible', v)
                },
                get() {
                    return this.visible
                },
            },
        },
    }
</script>

<style scoped lang="scss">
.dialog{
    position: fixed;
    z-index: 1000;
    left:0;
    right: 0;
    top:0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .mask{
        position: absolute;
        z-index: 1;
        left:0;
        right: 0;
        top:0;
        bottom: 0;
        width: 100%;
        height: 100%;

    }

    .body{
        position: absolute;
        bottom: 59px;
        width: 100%;
        height: 100%;
        margin: auto;
        z-index: 2;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .content{
            width: 78.93%;

        }

        .return-btn{
            margin-top: 17px;
            width: 170px;
            height: 45px;
        }

    }
}
</style>
