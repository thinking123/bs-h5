<template>
    <div class="page">
        <div class="title">
            欢迎来到摆设-我的音乐人格
        </div>
        <img src="../assets/img/home-img.png" class="img"/>
        <a class="link" href="javascript:;" @click="handleShowPlay">
            玩法说明
        </a>
        <h-button class=" route_btn" @click.native="handlePushPage">
            开始我的音乐之旅
        </h-button>
    </div>

</template>

<script>
    import HButton from "../components/HButton";
    export default {
        name: "Home",
        components: {HButton},
        methods: {
            handlePushPage() {
                this.$router.push({name:'interact'})
            },
            handleShowPlay(){
                console.log("show how to play")
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
        margin: 0 46px;
        position: relative;
    }

    .title {
        margin-top: 72px - $wxTitleBar;
        @include font-dpr($base-font-size)
    }

    .img {
        margin-top: 39px;
        height: 211px;
        width: 283px;
    }

    .link {
        margin-top: 26px;
        align-self: flex-end;
        text-decoration-line: underline;
    }

    .route_btn {
        position: absolute;
        bottom: 31px;

        left: 50%;
        transform: translateX(-50%);
        width: 154px;
        height: 32px;
        @include font-dpr($base-btn-font-size);
    }

</style>
