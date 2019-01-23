<template>
    <button class="btn" :disabled="disabled">
        {{text}}
        <span v-if="start" class="tip">
            {{remain}}
        </span>
    </button>
</template>

<script>
    export default {
        name: "RecordButton",
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            text:String,
            start:{
                type: Boolean,
                default: false
            },
            remain:{
                type: Number,
                default: 0
            }
        },
    }
</script>

<style scoped lang="scss">
    .tip{
        position: absolute;
        right: 10px;
        top:50%;
        transform: translateY(-50%);
    }
    .btn {
        position: relative;
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
