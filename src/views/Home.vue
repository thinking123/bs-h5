<template>
    <div class="page">
        <input ref="file" type="file" @change="handleChange" />
    </div>

</template>

<script>
    import HButton from "../components/HButton";
    import HowToPlayDialog from "../components/Dialog/HowToPlayDialog";
    export default {
        name: "Home",
        components: {HowToPlayDialog, HButton},
        data() {
            return {
                showHowtoplay: false
            }
        },
        methods: {
            handlePushPage() {
                this.$router.push({name:'interact'})
            },
            handleShowPlay(){
                this.showHowtoplay = true
                console.log("show how to play")
            },
            handleChange(){
                console.log('handleChange')
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/mixin";

    .page {
        display: flex;
        height: 100%;
        align-items: center;
        flex-direction: column;
        width: 100%;
        position: relative;
    }

    .title {
        margin-top: 72px - $wxTitleBar;
        @include font-dpr($base-font-size)
    }

    .img {
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

    .how-to-play{
        position: absolute;
        top: 23px;
        right: 9px;
        width: 21px;
        height: 76px;
        /*background-color: seagreen;*/
    }
    .route_btn {
        position: absolute;
        bottom: 59px;
        left: 50%;
        transform: translateX(-50%);

        width: 252px;
        height: 68px;
    }

</style>
