var mongoose = require('mongoose');

var async = require('async');

var bcrypt = require('bcryptjs');//数据加密
var salt = bcrypt.genSaltSync(10);

var schedule = require('node-schedule');
var wechatApi = require('./wechatapi')



var funcModel = require('../sysmanage/func/funcModel');
var menuModel = require('../sysmanage/menu/menuModel');
var roleModel = require('../sysmanage/role/roleModel');
var userModel = require('../sysmanage/user/userModel');

var constants = require('../frameConfig/constants');

//用户
var UserData = {
    userName: "18501609618",
    mobile: "18501609618",
    nickname:"管理员",
    password: "qwe123",
    openid: "",
    role: {
        roleDes:"系统管理员职责",
        roleName: constants.role.admin,//管理员角色
        menuList: [
            {
                menuName: "系统设置",
                funcList: [
                    {
                        funcNum:"1",
                        funcName: "菜单管理",
                        funcLink: "/dashboard/menu"
                    },
                    {
                        funcNum:"2",
                        funcName: "角色管理",
                        funcLink: "/dashboard/role"
                    },
                    {
                        funcNum:"3",
                        funcName:"用户管理",
                        funcLink:"/dashboard/user"
                    }
                ]
            },
            {
                menuName: "业务设置",
                funcList: [
                    {
                        funcNum:"1",
                        funcName: "供应商管理",
                        funcLink: "/dashboard/supplier/supplierlist"
                    },
                    {
                        funcNum:"2",
                        funcName:"商品管理",
                        funcLink:"/dashboard/goods"
                    },
                    {
                        funcNum:"3",
                        funcName:"套餐管理",
                        funcLink:"/dashboard/suite"
                    }
                ]
            }
        ]//菜单列表
    }
}

var initData = function () {
    var userModelInstance = new userModel();

    userModel
        .findOne({ userName: UserData.userName })
        .exec(function (err, userResult) {
            if (err) console.error(err.message);
            if (!userResult) {
                //新建role
                roleModel
                    .findOne({ roleName: UserData.role.roleName })
                    .exec(function (err, roleResult) {
                        if (err) console.error(err.message);
                        if (!roleResult) {//-----------------------------------------------rolecreate
                            //新建菜单，菜单是数组，需要循环添加
                            var menulisttemp = [];//menu id的数组
                            async.each(UserData.role.menuList, function (itemmenuValue, callback) {
                                menuModel
                                    .findOne({ menuName: itemmenuValue.menuName })
                                    .exec(function (err, menuResult) {
                                        if (err) console.log(err.message);
                                        if (!menuResult) {//---------------------------------------menucreate
                                            var funclistTemp = [];//function的id数组

                                            //新建功能，功能列表是数组，需要循环添加
                                            async.each(itemmenuValue.funcList, function (itemfuncValue, callback1) {
                                                funcModel
                                                    .findOne({ funcName: itemfuncValue.funcName })
                                                    .exec(function (err, funcResult) {
                                                        if (err) console.log(err.message);
                                                        if (!funcResult) {
                                                            var funcInstance = new funcModel(itemfuncValue);
                                                            funcInstance.save(function (err, funcSaveResult) {
                                                                if (err) console.log(err);
                                                                if (funcSaveResult) {
                                                                    funclistTemp.push(funcSaveResult._id);
                                                                    console.log("功能:["+itemfuncValue.funcName+"]" + "创建成功！")
                                                                    callback1();
                                                                }
                                                            })
                                                        }
                                                    })
                                            }, function (err) {
                                                //---------------------------------------menucreate
                                                var menuInstance = new menuModel({
                                                    menuName: itemmenuValue.menuName,
                                                    funcList: funclistTemp
                                                })
                                                menuInstance.save(function (err, menuSaveResult) {
                                                    if (err) console.log(err);
                                                    if (menuSaveResult) {
                                                        menulisttemp.push(menuSaveResult._id);
                                                        console.log("菜单:["+itemmenuValue.menuName+"]" + "创建成功！")
                                                        callback();
                                                    }
                                                })
                                            })

                                        }
                                    })

                            }, function (err) {
                                //-----------------------------------------------rolecreate
                                if (err) console.log(err.message);

                                var roleInstance = new roleModel(
                                    {
                                        roleDes:"系统管理员职责",
                                        roleName: constants.role.admin,
                                        menuList: menulisttemp
                                    }
                                )
                                roleInstance.save(function (err, roleSaveResult) {
                                    if (err) console.log(err)
                                    if (roleSaveResult) {
                                        console.log("角色:["+constants.role.admin+"]" + "创建成功！")
                                        var userInstance = new userModel({
                                            username: UserData.userName,
                                            nickname:UserData.nickname,
                                            mobile: UserData.mobile,
                                            password: bcrypt.hashSync(UserData.password, salt),
                                            openid: UserData.openid,
                                            role: roleSaveResult._id

                                        })

                                        userInstance.save(function (err, userSaveResult) {
                                            if (err) console.log(err);

                                            if (userSaveResult) {
                                                console.log("用户:["+userSaveResult.username +"]"+ "创建成功！")
                                            }
                                        })
                                    }
                                })


                            })


                        }
                    })


            }
        })


}

var setSchedule=function(){
    schedule.scheduleJob('* /120 * * * *', function(){
        console.log('定时任务:' + new Date());
        wechatApi.getApiToken();
    }); 
}



module.exports = { initData ,setSchedule};





