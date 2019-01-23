<template>
    <div class="nav-item">
        {{text}}
    </div>
</template>

<script>
    export default {
        name: "HNavItem",
        props: {
            text: {
                type: String
            },
        },
    }
</script>

<style scoped>
    .nav-item {
        display: inline-block;
    }
</style>
