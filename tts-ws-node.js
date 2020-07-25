const CryptoJS = require('crypto-js')
var log = require('log4node')
var fs = require('fs')
    

// 系统配置 
const config = {
    // 请求地址
    hostUrl: "wss://tts-api.xfyun.cn/v2/tts",
    host: "tts-api.xfyun.cn",
    //在控制台-我的应用-在线语音合成（流式版）获取
    appid: "5f0e5a41",
    //在控制台-我的应用-在线语音合成（流式版）获取
    apiSecret: "460163f2175c1c59569ce9afaa856c63",
    //在控制台-我的应用-在线语音合成（流式版）获取
    apiKey: "18607e3c515337bf2a3ada2098e7eb29",
    text: "一，一二三的一",
    uri: "/v2/tts",
}


// 设置当前临时状态为初始化


// 鉴权签名
function getAuthStr(date) {
    let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
    let signature = CryptoJS.enc.Base64.stringify(signatureSha)
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
    return authStr
}


// 保存文件
function save(data, word) {
    fs.writeFile(`./audio/` + word + `.mp3`, data, { flag: 'a' }, (err) => {
        if (err) {
            console.error('save error: ' + err)
            return 
        }

        log.info('文件保存成功')
    })
}

module.exports = {
    config,
    getAuthStr,
    save
}
