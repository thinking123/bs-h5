<template>
    <button class="btn" @touchstart="handleStart"
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
                pressing: false
            }
        },
        methods: {
            handleStart() {
                this.pressing = true
            },
            handleEnd(){
                this.pressing = false
            }
        },
    }
</script>

<style scoped lang="scss">
    $btn-size: 57px;
    .btn {
        width: $btn-size;
        height: $btn-size;
        border-radius: $btn-size;
        font-size: $music-btn-font-size;
        &.pressing{

        }

        &:active{
            background-color: #04BE02;
            color:white;
        }
    }


</style>
