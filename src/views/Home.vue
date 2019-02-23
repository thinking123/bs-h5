<template>
    <div class="container">
        <img :src="bg" class="img"/>
        <div class="how-to-play" @click="handleShowPlay"/>
        <div class="start-my-music-journey" @click="handlePushPage"/>
        <how-to-play-dialog :visible.sync="showHowtoplay"/>
    </div>

</template>

<script>
    import HButton from "../components/HButton";
    import HowToPlayDialog from "../components/Dialog/HowToPlayDialog";
    import {getSignInfo} from "../utils/http";
    import {mapGetters} from 'vuex'

    const page = 'music-journey-'
    export default {
        name: "Home",
        components: {HowToPlayDialog, HButton},
        computed: {
            ...mapGetters(['base']),
            bg() {
                return `${this.base}${page}bg.png`
            }
        },
        data() {
            return {
                showHowtoplay: false
            }
        },

        mounted() {
            this.init()
        },
        methods: {
            async init() {
                try {
                    const {
                        appid,
                        noncestr,
                        signature,
                        timestamp
                    } = await getSignInfo(window.location.href)

                    console.log(res)
                } catch (e) {
                    console.log('error ', e)
                }
            },
            handlePushPage() {
                this.$router.push({name: 'interact'})
            },
            handleShowPlay() {
                this.showHowtoplay = true
                console.log("show how to play")
            },
            handleChange() {
                console.log('handleChange')
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/mixin";

    /*page{*/
    /*height: 100%;*/
    /*width: 100%;*/
    /*}*/
    .container {
        height: 100%;
        width: 100%;
        position: relative;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    .img {
        height: 100%;
        width: 100%;
    }

    .how-to-play {
        position: absolute;
        top: 2.4%;
        left: 676px;
        height: 14.09%;
        width: 64px;
        border: 1px solid yellow;
    }

    .start-my-music-journey {
        position: absolute;
        top: 75.41%;
        left: 50%;
        transform: translateX(-50%);
        height: 9.3%;
        width: 476px;
        border: 1px solid yellow;
    }


</style>
