<template>
    <div class="layout">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "Layout"
    }
</script>

<style scoped>
    .layout{
        width: 100%;
        height: 100%;
        background-color: transparent;
    }
</style>
