var mongoose = require('mongoose');

var async = require('async');

var funcModel = require('../sysmanage/func/funcModel');
var menuModel = require('../sysmanage/menu/menuModel');
var roleModel = require('../sysmanage/role/roleModel');



//本来上面应该再写一个fun的对象新建，直接省去了

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

//菜单
var Menu = {
    menuName: "用户管理",
    funcList: []
}

var initData = function () {

    var funcResults = [];
    //添加功能
    async.each(FuncList, function (itemValue, callback) {
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
                            funcResults.push(SaveResult);
                            // console.log(funcResults);
                            console.log("添加功能成功！")
                            callback();
                        }
                    })
                }
            });


    }, function (err) {
        if (err) console.error(err.message);
        addMenu(funcResults)
    });


}
//添加菜单
var addMenu = function (funcList) {
    //console.log("addMenu:" + funcList)
    Menu.funcList = funcList;
    console.log("menu:" + JSON.stringify(Menu));

    menuModel
        .findOne({ menuName: Menu.menuName })
        .exec(function (err, menuResult) {
            if (err) console.log("seed.js:查找menu失败");
            if (!menuResult) {
                var menuTemp = new menuModel(Menu);
                menuTemp.save(function (err, SaveResult) {
                    if (err) {
                        console.log("seed.js:添加menu失败")
                    }
                    if (SaveResult) {
                        console.log("seed.js:添加menu成功")
                    }
                })
            }
        })
}



module.exports = { initData };





