var MainLayer = function () {
    this.isClick = false;


};
MainLayer.prototype = {
    init: function () {
        this.initListener();
    },
    initListener: function () {
        var self = this;
        $('.noTouch').click(function () {
            return false;
        });

        $(function () {
            FastClick.attach(document.body);
        });



        $('#load_touch').on('click', function (e) {
            var self = this;


            if (this.isClick) return;

            this.isClick = true;


            e.preventDefault()
            game.playFirstVideo()
            setTimeout(function () {
                $('#skip').css('display','block')

            },2000)
            _hmt.push(['_trackEvent', '两会' + h5_config.fr, '安卓播放第1个视频']);

        })


        $('#button_click').on('click', function (e) {
            e.preventDefault();
            if (this.isClick) return;
            this.isClick = true;
            videoPlay()
            _hmt.push(['_trackEvent', '两会' + h5_config.fr, '播放第二个视频']);

        });


        //视频
        $('#skipBtn').on('touchend', function () {
            $('#page_4').css('display','none')
            $('#page_2_1').css('display', 'none')
            $('#page_1').css('display', 'none')

            self.videoEnd()
            _hmt.push(['_trackEvent', '两会' + h5_config.fr, '跳过']);


        })

        //视频点击出挂断效果

        var nowClick = 1;
        $('#page_4').on('touchstart',function (e) {
            e.preventDefault()
            nowClick++;

            if(nowClick%2==0){
                $('#skipBtn').fadeIn(500)
            }else{
                $('#skipBtn').fadeOut(500)

            }

        })




        $('#button_return').on('touchend', function (e) {
            e.preventDefault()


            game.nowTimes == game.totalVideo - 1 ? game.nowTimes = 0 : game.nowTimes++;
            videoPlay()


            _hmt.push(['_trackEvent', '两会' + h5_config.fr, '再次播放']);

        })




        var ua = window.navigator.userAgent;

        var TBS = ua.match(/TBS\/([\d.]+)/);

        //随机视频的播放

        function videoPlay() {
            // Music.pause()


            game.effect.play()

            setTimeout(function () {
                game.effect.pause()
            },3000)


            var random = game.videoArr[game.nowTimes]

            game.nowVideo = random;


            if(game.nowVideo == 3||game.nowVideo == 7||game.nowVideo == 18||game.nowVideo == 21||game.nowVideo == 24||game.nowVideo == 29) {

                game['video' + game.nowVideo] = new Video({
                    id: 'container_video',
                    parentId: 'root2',
                    videoId: 'video' + game.nowVideo,
                    //url 写在配置表里
                    src: h5_config.baseUrl_video2 + 'res/video/video' + game.nowVideo + '.mp4'
                    // src: './res/video/video' + i + '.mp4'

                });
            }else{
                game['video' + game.nowVideo] = new Video({
                    id: 'container_video',
                    parentId: 'root2',
                    videoId: 'video' + game.nowVideo,
                    //url 写在配置表里
                    src: h5_config.baseUrl_video + 'res/video/video' + game.nowVideo + '.mp4'
                    // src: './res/video/video' + i + '.mp4'

                });

            }



            if (game.isWeibo) {
                enableInlineVideo(game['video' + game.nowVideo].element)

            }
            game['video' + game.nowVideo].update();

            $('#page_1').css('display', 'none')
            $('#page_3').css('display','none')
            $('#button_return').css('display','none')
            $('#ele_1').css('display','none')
            $('#initName').html(config.infoList[game.nowVideo - 1].name)
            $('#initCity').html(config.infoList[game.nowVideo - 1].city)


            $('#page_2_2').css('display', 'block')
            if (game.nowTimes > 0) {
                $('#page_2_1').css('display', 'block')

            }
            setTimeout(function () {
                // $('#showOut').css('display','none')
                $('#page_2').css('display', 'block')

                $('#page_2_1').css('display', 'none')
                $('#page_2_2').css('display', 'none')


            }, 2000)

            setTimeout(function () {
                // $('#showOut').css('display','none')

                $('#page_2').fadeOut(500)
                $('#page_4').css('display','block')
                $('#skipBtn').css('display','block')

                setTimeout(function () {
                    $('#skipBtn').fadeOut()

                },2000)


            }, 3000)


            $('#music_box').css('display', 'none');


            $('#video').css({'display': 'none', 'opacity': 0})


            // game.updateShare(1)
            game['video' + random].play()

            game['video' + random].update()
            game['video' + random].show()

            $('#video' + random).css({'opacity': '1', 'display': 'block'})

            game['video' + random].setUpdateCallback(function () {

                var currentTime = game['video' + random].getCurrentTime();
                if (currentTime > 3) {

                    $('#page_1').css('display', 'none')

                }

            });
            /*   setTimeout(function () {
                   $('#skip').css('display', 'block');

               }, 4000)*/

            var isEnd = false;
            game['video' + random].on('x5videoexitfullscreen', function () {
                if(isEnd){
                    self.videoEnd(1)

                }else{
                    self.videoEnd()

                }

            })

            var onEnded = function () {
                $(game['video' + random].element).unbind('ended', onEnded);

                self.videoEnd()
                isEnd = true;


            }


            $(game['video' + random].element).bind('ended', onEnded);


        }


    },

    videoEnd: function (index) {


        game.effect.pause()
        $('.slideAll1').css('display', 'block')
        $('.slideAll').css('display', 'none')

        $('#page_4').css('display','none')

        $('#page_3').css('display','block')

        setTimeout(function () {
            game.frameMove2('logo', 68, 50,function () {
                $('#ele_1').css('display','block')
                $('#logo').css('display','none')

            });
            if(!index){
                $('#logo').css('display','block')
            }

            setTimeout(function () {
                $('#button_return').css('display','block')

            },4200)

        },800)


        $('#video' + game.nowVideo).css('opacity', '0')
        setTimeout(function () {
            game['video' + game.nowVideo].stop();

        },200)




        self.isClick = false;

    }

};