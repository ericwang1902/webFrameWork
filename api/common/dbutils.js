//用来连接mongodb，并返回数据库实例

//数据库链接工具
var mongoose = require('mongoose')

var Config = require('../frameConfig/frameConfig')

mongoose.Promise = require('bluebird');

module.exports = {
    createconnection: function () {
        var options = {
            user: 'ericwang1903',
            pass: 'qwer12345'
        }
        mongoose.connect('mongodb://localhost:20008/' + Config.databaseName,options);
    },
    getconnection: function () {
        return mongoose.connection;
    }
}