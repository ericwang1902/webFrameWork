//用来连接mongodb，并返回数据库实例

//数据库链接工具
var mongoose = require('mongoose')

var Config = require('../frameConfig/frameConfig')

module.exports = {
    createconnection: function () {
        var options = {
            user: 'ericwang1903',
            pass: 'qwer12345',
            promiseLibrary: require('bluebird')
        }
        mongoose.connect('mongodb://localhost:20008/' + Config.databaseName,options);
    },
    getconnection: function () {
        return mongoose.connection;
    }
}