<template>
    <button class="btn" :disabled="disabled">
        <slot/>
    </button>
</template>

<script>
    export default {
        name: "HButton",
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
        },
    }
</script>

<style scoped lang="scss">
    .btn {
        height: 30px;
        width: 124px;
        font-size: $base-btn-font-size;
        margin-top: 0;
        text-decoration: none;
        color: white;
        background-color: #1AAD19;
        border-width: 0;
        outline: 0;
        -webkit-appearance: none;

        border-radius: 5px;

        margin-left: auto;
        margin-right: auto;
        padding-left: 14px;
        padding-right: 14px;

        &:active {
            color: rgba(255, 255, 255, .6);
            background-color: #179B16;;
        }

        &[disabled] {
            color: rgba(0, 0, 0, .3);
            background-color: #9ED99D;
        }
    }
</style>
