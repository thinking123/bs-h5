import http from './axios'

const HTTP_OK = '200';

function parseRespond(res) {
    const {status, msg, code} = res;

    if (code && msg) {
        throw new Error(msg);
    } else {
        return res
    }
}

async function checkInvitationCode(params) {
    const url = `/interface/checkInvitationCode`
    return http.get(url, {params}).then(parseRespond)
}


async function register(params) {
    const url = `/interface/register`
    return http.get(url, {params}).then(parseRespond)
}

export async function getLink(params = {}) {
    const url = `/interface/getLink`
    return http.get(url, {params}).then(parseRespond)
}

export async function checkPhone(params) {
    const url = `/interface/checkPhone`
    return http.get(url, {params}).then(parseRespond)
}

export async function checkOpenid(params) {
    const url = `/interface/checkOpenid`
    return http.get(url, {params}).then(parseRespond)
}

export async function getUser(params) {
    const url = `/interface/getUser`
    return http.get(url, {params}).then(parseRespond)
}

export async function uploadFile(formData) {
    const url = `/interface/uploadImg`
    console.log('form data', formData)
    return http.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'text/plain'
        }
    }).then(parseRespond)
}


export async function uploadRecord(openid , mediaId) {


    const url = `/api/misic/uploadQiniuyun`
    return http.post(url, {
        openid,mediaId
    }).then(res=>res.rows)
}

export async function getSignInfo(link) {


    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    let signUrl=''
    if (isAndroid) {
        signUrl=location.href.split('#')[0]
        // signUrl=link
        signUrl = encodeURIComponent(signUrl)
        console.log("signUrl" , signUrl)
    }
    if (isIOS) {
        signUrl=location.href.split('#')[0]  //hash后面的部分如果带上ios中config会不对
        signUrl = encodeURIComponent(signUrl)
    }

    const url = `/api/misic/signature?url=${signUrl}`
    const data = {
        url: signUrl
    }
    return http.post(url, {}, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res=>res.rows)
}
export async function login() {
    const url = `/login/api/login/htmllogin`
    return http.post(url, {}, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res=>res)
}





export default {
    checkInvitationCode,
    register,
    getLink,
    getUser,
    getSignInfo,

}
