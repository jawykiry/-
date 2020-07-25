var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'cdb-16btmcvc.cd.tencentcdb.com',
  port     : '10141',
  user     : 'root',
  password : 'jiawei0812*',
  database : 'ywtx'
});

connection.connect();
 

module.exports = {
  connection
}