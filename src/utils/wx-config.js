export const shareInWx = (data, params) => {
    wx.config({
        debug: false,
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [
            //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
            'updateAppMessageShareData',
            //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            'updateTimelineShareData'
        ]
    })

    var _conf = {
        title: params.title, // 分享标题
        desc: params.content, // 分享描述
        link: params.url || window.location.href, // 分享链接
        imgUrl: params.imageUrl, // 分享图标
        type: null, // 分享类型,music、video或link，不填默认为link
        dataUrl: null, // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            console.log('show success')
        }
    }

    wx.ready(function () {
        // “分享给朋友”及“分享到QQ”
        wx.updateAppMessageShareData(_conf)
        // “分享到朋友圈”及“分享到QQ空间”
        wx.updateTimelineShareData(_conf)
    })
}

export const wxRecordConfig = (data) => {
    wx.config({
        debug: false,
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'onVoicePlayEnd',
            'uploadVoice',
            'downloadVoice'
        ]
    })
}

// return new Promise((resolve ,reject) =>{
//
// })
export const startRecord = () => {
    return new Promise((resolve, reject) => {
        wx.startRecord({
            success: function (res) {
                resolve(res)
            },
            fail: err => reject(err)
        })
    })

    // wx.startRecord();
}
export const stopRecord = () => {
    return new Promise((resolve, reject) => {
        wx.stopRecord({
            success: function (res) {
                var localId = res.localId;
                resolve(res.localId)
            },
            fail: err => reject(err)
        })
    })
}
export const playRecord = (localId) => {
    wx.playVoice({
        localId// 需要播放的音频的本地ID，由stopRecord接口获得
    });
}

export const stopPlayRecord = (localId) => {
    wx.stopVoice({
        localId // 需要停止的音频的本地ID，由stopRecord接口获得
    });
}

export const playEnd = (localId) => {
    return new Promise((resolve, reject) => {
        wx.onVoicePlayEnd({
            success: function (res) {
                var localId = res.localId; // 返回音频的本地ID
                resolve(res.localId)
            },
            fail: err => reject(err)
        })
    })
}


export const uploadRecord = (localId) => {
    return new Promise((resolve, reject) => {
        wx.uploadVoice({
            localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId; // 返回音频的服务器端ID
                resolve(serverId)
            },
            fail: err => reject(err)
        });
    })
}
