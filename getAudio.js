const API =  require('./tts-ws-node')
const WebSocket = require('ws')
const mysql = require('./mysql')
var fs = require('fs')

// 获取当前时间 RFC1123格式
let date = (new Date().toUTCString())


function saveAudio(word, name){
    
    let wssUrl = API.config.hostUrl + "?authorization=" + API.getAuthStr(date) + "&date=" + date + "&host=" + API.config.host

    let ws = new WebSocket(wssUrl)
    // 连接建立完毕，读取数据进行识别
    ws.on('open', () => {
        console.log("websocket connect!")
        send(word)
        // 如果之前保存过音频文件，删除之
        if (fs.existsSync(`./audio/` + name + `.mp3`)) {
            fs.unlink(`./audio/` + name + `.mp3`, (err) => {
                if (err) {
                    console.log('remove error: ' + err)   
                }
            })
        }
    })


    // 得到结果后进行处理，仅供参考，具体业务具体对待
    ws.on('message', (data, err) => {
        console.log(name, word)
        if (err) {
            console.log('message error: ' + err)
            return
        }

        let res = JSON.parse(data)

        if (res.code != 0) {
            console.error(`${res.code}: ${res.message}`)
            ws.close()
            return
        }

        audio = res.data.audio
        let audioBuf = Buffer.from(audio, 'base64')
        API.save(audioBuf, name)

        if (res.code == 0 && res.data.status == 2) {
            ws.close()
        }
    })

    // 资源释放
    ws.on('close', () => {
        console.log('connect close!')
    })

    // 连接错误
    ws.on('error', (err) => {
        console.log("websocket connect err: " + err)
    })

    // 传输数据
    function send(word) {
        let frame = {
            // 填充common
            "common": {
                "app_id": API.config.appid
            },
            // 填充business
            "business": {
                "aue": "lame",
                "auf": "audio/L16;rate=16000",
                "vcn": "x2_yezi",
                "tte": "UTF8",
                "speed": 30
            },
            // 填充data
            "data": {
                "text": Buffer.from(word).toString('base64'),
                "status": 2
            }
        }
        ws.send(JSON.stringify(frame))
    }
}

module.exports = {saveAudio}