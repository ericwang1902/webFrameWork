var mongoose = require('mongoose');

var async = require('async');

var funcModel = require('../sysmanage/func/funcModel');
var menuModel = require('../sysmanage/menu/menuModel');
var roleModel = require('../sysmanage/role/roleModel');


//功能写入数据库，所有管理后台的菜单都需要在里初始化进入到数据库
var FuncList = [
    {
        funcName: "添加角色",
        funcLink: "/role/addrole"
    },
    {
        funcName: "添加角色2",
        funcLink: "/role/addrole1"
    }
]

var initData = function () {
    //添加功能
    async.eachOf(FuncList, function (itemValue, itemIndex, callback) {
        //遍历数组来存储funcList的内容
        funcModel
            .findOne({ funcName: itemValue.funcName })
            .exec(function (err, funcResult) {
                if (err) {
                    console.log("seed.js:查找func失败");
                }
                if (!funcResult) {
                    var funcTemp = new funcModel(itemValue);
                    funcTemp.save(function (err, SaveResult) {
                        if (err) {
                            console.log("seed.js:添加功能失败");
                        }
                        if (SaveResult) {
                            console.log("添加功能成功！")
                        }
                    })
                }
            });

        callback();

    })
}

module.exports = { initData };





