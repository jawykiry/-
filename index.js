//const API =  require('./tts-ws-node')
//const WebSocket = require('ws')
const mysql = require('./mysql')
const Audio = require('./getAudio.js')

// 获取当前时间 RFC1123格式
//let date = (new Date().toUTCString())


/**
 * 和数据库连接获取需要听写的字
 */
var sql = 'SELECT * FROM tx_word where 460 < id and id <= 474'
var arr1 = []
var arr2 = []
var count = 0

mysql.connection.query(sql, function(err, result){
    result.forEach( (item ,index) => {
        if(item.speak != null){
            arr1[index] = JSON.parse(item.speak)   
        }else{
            arr1[index] = JSON.parse(item.content) 
        }
    })
    for(var i = 450; i < arr1.length + 450; i++){
        //console.log(i-438)
        for(var w = 0; w < arr1[i - 450].length; w++){
            arr2[count++] = i + "." + w
        }
    }
    count = 0
});
mysql.connection.end();

/**
 * 调用讯飞接口获取base64数据
 */

setTimeout(function(){
    for(var m = 0; m < arr1.length; m++){
        for(var i = 0; i < arr1[m].length; i++){
            console.log(arr2[count])
            Audio.saveAudio(arr1[m][i], arr2[count++])
        }
    }
    //Audio.saveAudio(arr1[0][0], arr2[0])
}, 600)
