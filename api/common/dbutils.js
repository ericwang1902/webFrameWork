//用来连接mongodb，并返回数据库实例

//数据库链接工具
var mongoose = require('mongoose')

var Config = require('../frameConfig/frameConfig')

module.exports = {
    createconnection: function () {
       mongoose.connect('mongodb://localhost/' + Config.databaseName);
    },
    getconnection: function () {
        return mongoose.connection;
    }
}