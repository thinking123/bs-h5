<template>
    <div class="layout">
        <router-view></router-view>
        <loading-bar/>
    </div>
</template>

<script>
    import LoadingBar from "../LoadingBar";
    export default {
        name: "Layout",
        components: {LoadingBar}
    }
</script>

<style scoped>
    .layout{
        width: 100%;
        height: 100%;
        background-color: transparent;
        overflow: hidden;
    }
</style>
