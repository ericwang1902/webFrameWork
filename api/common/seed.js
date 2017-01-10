var mongoose = require('mongoose');

var async = require('async');

var funcModel = require('../sysmanage/func/funcModel');
var menuModel = require('../sysmanage/menu/menuModel');
var roleModel = require('../sysmanage/role/roleModel');
var userModel = require('../sysmanage/user/userModel');

var constants = require('../frameConfig/constants');



//本来上面应该再写一个fun的对象新建，直接省去了

//功能写入数据库，所有管理后台的菜单都需要在里初始化进入到数据库
var FuncList = [
    {
        funcName: "添加功能",
        funcLink: "/func/addfunc"
    },
    {
        funcName: "修改功能",
        funcLink: "/func/modifyfunc"
    },
    {
        funcName: "添加角色",
        funcLink: "/role/addrole"
    },
    {
        funcName: "修改角色",
        funcLink: "/role/modifyrole"
    }
]

//菜单列表
var MenuList = [
    {
        menuName: "角色管理",
        funcList: [
            {
                funcName: "添加角色",
                funcLink: "/role/addrole"
            },
            {
                funcName: "修改角色",
                funcLink: "/role/modifyrole"
            }
        ]
    },
    {
        menuName: "功能管理",
        funcList: [
            {
                funcName: "添加功能",
                funcLink: "/role/addrole"
            },
            {
                funcName: "修改功能",
                funcLink: "/role/modifyrole"
            }
        ]
    }
]

//角色
var RoleData = {
    roleName: constants.role.admin,//管理员角色
    menuList: []//菜单列表
}

//用户
var UserData = {
    userName :"sysadmin",
    mobile:"18501609618",
    password:"qwe123",
    openid:"",
    role:{}
}


//添加功能
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
        addMenu(MenuList);
    });


}
//添加菜单
var addMenu = function (menuList) {
    //console.log("addMenu:" + funcList)
    var menuRefList = [];

    console.log("menu:" + JSON.stringify(menuList));

    async.each(menuList, function (itemValue, callback) {
        menuModel
        .findOne({ menuName: itemValue.menuName })
        .exec(function (err, menuResult) {
            if (err) console.log("seed.js:查找menu失败");
            if (!menuResult) {
                var menuTemp = new menuModel(itemValue);
                menuTemp.save(function (err, SaveResult) {
                    if (err) {
                        console.log("seed.js:添加menu失败")
                    }
                    if (SaveResult) {
                        menuRefList.push(SaveResult);
                        console.log("seed.js:添加menu成功")
                        callback();
                    }
                })
            }
        })

    }, function (err) {
        if(err) console.error(err.message);
        
        addRole(menuRefList)    
    });

    
}
//添加角色
var addRole = function (menuRefList) {
    RoleData.menuList = menuRefList;

    roleModel
    .findOne({roleName:RoleData.roleName})
    .exec(function(err,roleResult){
        if(err) console.log("seed.js:查找role失败");

        if(!roleResult){
            var roleTemp = new roleModel(RoleData);
            roleTemp.save(function(err,SaveResult){
                if(err) console.log("seed.js:添加role失败")

                if(SaveResult){
                    console.log("seed.js:添加role成功")
                    addUser(SaveResult._id);
                }
            })
        }
    })
}

//添加用户
 var addUser = function(roleId){
     UserData.role = roleId;

     userModel
     .findOne({userName:UserData.userName})
     .exec(function(err,userResult){
         if(err) console.log("seed.js:查找user失败")
         
         if(!userResult){
             var userTemp = new userModel(UserData);

             userTemp.save(function(err,SaveResult){
                 if(err) console.error(err.message);

                 if(SaveResult){
                     console.log("seed.js:添加user成功")
                 }
             })
         }
     })

 }



module.exports = { initData };





