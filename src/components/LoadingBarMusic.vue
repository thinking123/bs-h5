<template>
    <div class="loading-bar">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>
</template>

<script>
    export default {
        name: "LoadingBarMusic"
    }
</script>

<style scoped lang="scss">
    .loading-bar {
        /*.square(32px);*/
        width: 16px;
        height: 15px;
        display: block;
        display: flex;
        flex-direction: row;
        margin: auto;
        z-index: 2;
        .bar {
            margin: 0 1px;
            width: 2px;
            height: 15px;
            /*animation: loading 1s 1s linear infinite normal;*/
            animation-name: loading;
            background-color: white;
            animation-duration: 0.5s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            animation-direction: alternate;
            &:nth-child(3) {
                animation-delay: 0.3s;
            }

            &:nth-child(2) {
                animation-delay: 0.15s;
            }
            &:nth-child(4) {
                animation-delay: 0.15s;
            }
        }
    }

    @keyframes loading {
        0% {
            margin-top:0px;
            height: 15px;
        }
        10% {
            margin-top:1px;
            height: 13px;
            margin-bottom:1px;
        }
        20% {
            margin-top:2px;
            height: 11px;
            margin-bottom:2px;
        }
        30% {
            margin-top:3px;
            height: 9px;
            margin-bottom:3px;
        }
        40% {
            margin-top: 4px;
            height:7px;
            margin-bottom:4px;
        }
        50% {
            margin-top: 5px;
            height: 5px;
            margin-bottom:5px;
        }
        60% {
            margin-top: 6px;
            height: 3px;
            margin-bottom:6px;
        }
        100% {
            margin-top: 7px;
            height: 1px;
            margin-bottom:7px;
        }
    }

</style>

