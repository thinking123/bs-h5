<template>
    <div class="page">
        <div class="nav-bar">
            <div v-for="(item , index) in navs" :key="item.key" class="nav-bar-item"
                 :class="{'selected':item.key === selected}"
                 @click="handleSwitchTabItem(item)"
            >
                {{item.text}}
            </div>
        </div>

        <div class="body">
            <div class="music-wrap">
                <div class="row row1 ">
                    <div class="row-col-4 center " v-for="item in row1"
                         :key="item.key"
                         @handleClick="handleMusicClick">
                        <music-button>
                            {{item.text}}
                        </music-button>
                    </div>

                </div>
                <div class="row row2">
                    <div class="row-col-4 center " v-for="item in row2"
                         :key="item.key"
                         @handleClick="handleMusicClick">
                        <music-button>
                            {{item.text}}
                        </music-button>
                    </div>
                </div>
            </div>
            <h-button class="record_btn btn-size" @click.native="handleStartRecord">
                开始录制
            </h-button>
            <img src="../assets/img/music-bar.png" class="img"/>
            <div class="btn-group">
                <h-button class="btn btn-size" :disabled="!recorded" @click.native="handlePlay">
                    播放
                </h-button>
                <h-button class="btn btn-size" :disabled="!recorded" @click.native="handleSave">
                    保存本地
                </h-button>
            </div>
            <h-button class="link_btn btn-size" :disabled="!recorded" @click.native="handleGotoMusicPage">
                测试我的音乐人格
            </h-button>
            <!--<div class="footer">-->
            <!---->
            <!--</div>-->

        </div>

    </div>
</template>

<script>
    import MusicButton from "../components/MusicButton";
    import HButton from "../components/HButton";

    export default {
        name: "ArrangementsInteract",
        components: {HButton, MusicButton},
        data() {
            return {
                navs: [
                    {key: 'gq', text: '钢琴'},
                    {key: 'jt', text: '吉他'},
                    {key: 'gz', text: '古筝'},
                ],
                selected: 'jt',
                row1: [
                    {key: 'do', text: 'Do'},
                    {key: 'ri', text: 'Ro'},
                    {key: 'mo', text: 'Mo'},
                    {key: 'fa', text: 'Fo'},
                ],
                row2: [
                    {key: 'so', text: 'So'},
                    {key: 'la', text: 'La'},
                    {key: 'xi', text: 'Xi'}
                ],
                recorded:false
            }
        },
        methods: {
            handleSwitchTabItem(item) {
                if (item.key !== this.selected) {
                    this.selected = item.key
                }
            },
            handleMusicClick() {

            },
            handleStartRecord(){
                this.recorded = true
                console.log('start recode')
            },
            handlePlay(){

            },
            handleSave(){

            },
            handleGotoMusicPage(){
                if(this.recorded){
                    this.$router.push({name:'individuality'})
                }

            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/mixin";
    $radius: 5px;

    .page{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .nav-bar {
        display: flex;
        height: 38px;

        .nav-bar-item {
            display: flex;
            justify-content: center;
            align-items: center;

            border: 1px solid;
            border-top-left-radius: 2px;
            border-radius: $radius $radius 0 0;
            flex: 1;

            &.selected {
                border-bottom: none;

            }
        }
    }

    .btn-size{
        @include font-dpr($base-btn-font-size);
    }
    .body{
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        flex:1;
        .music-wrap{
            align-self: stretch;
        }

        .record_btn{
            margin-top: 67px;
        }

        .img{
            height: 73px;
            width: 322px;
            position: absolute;
            left:50%;
            transform: translateX(-50%);
            /*bottom:  33.1%;*/
            bottom:  26.3%;
        }

        .btn-group{
            position: absolute;
            /*bottom:  24.5%;*/
            bottom:  17.6%;
            display: flex;
            flex-direction: row;
            width: 100%;

            .btn {
                margin-top: 0 !important;
                width: 123px;
            }
        }

        .link_btn{
            position: absolute;
            /*bottom: 67px;*/
            width: 149px;
            bottom: 22px;
            left:50%;
            transform: translateX(-50%);
        }

        .footer{
            position: absolute;
            bottom:0;
            /*.img{*/
                /*margin-top: 56px;*/
                /*height: 73px;*/
                /*width: 322px;*/
            /*}*/

            /*.btn-group{*/

            /*}*/

            /*.link_btn{*/

            /*}*/
        }

    }






    $padding: 30px;
    $gutter: 0px;
    .row1{
        margin-top: 26px;
    }
    .row2{
        margin-top: 35px;
    }
    .row {
        box-sizing: content-box;
        padding: 0 30px;

        &:before, &:after {
            content: " ";
            display: table;
        }

        &:after {
            clear: both;
        }


        & [class^="row-col-"] {
            float: left;
        }

        .row-col-4 {
            width: 25%;
            display: inline-block;

        }

        .center{
            text-align: center;
        }
    }
</style>
