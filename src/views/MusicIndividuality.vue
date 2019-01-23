<template>
    <div class="page">
        <img src="../assets/img/music-individuality-bg.png" class="img"/>
        <h-button @click="handleShare" class="btn">
            分享
        </h-button>
    </div>
</template>

<script>
    import HButton from "../components/HButton";
    export default {
        name: "MusicIndividuality",
        components: {HButton},
        methods: {
            handleShare() {
                console.log('share')
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/mixin";
    .page{
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        .img{
            margin-top: 85px - $wxTitleBar;
            width: 300px;
            height: 63.7%;
        }

        .btn{
            position: absolute;
            bottom: 24px;
            left:50%;
            transform: translateX(-50%);

            @include font-dpr($base-btn-font-size);
        }
    }
</style>
