var mongoose = require('mongoose');

var async = require('async');

var bcrypt = require('bcryptjs');//数据加密
var salt = bcrypt.genSaltSync(10);

var schedule = require('node-schedule');
var wechatApi = require('./wechatapi')

var config = require('../frameConfig/frameConfig')



var funcModel = require('../sysmanage/func/funcModel');
var menuModel = require('../sysmanage/menu/menuModel');
var roleModel = require('../sysmanage/role/roleModel');
var userModel = require('../sysmanage/user/userModel');
var districtModel = require('../sysmanage/district/districtModel');

var constants = require('../frameConfig/constants');

//用户
var UserData = {
    userName: "18501609618",
    mobile: "18501609618",
    nickname: "管理员",
    password: "qwe123",
    openid: "",
    role: {
        roleDes: "系统管理员职责",
        roleName: constants.role.admin,//管理员角色
        menuList: [
            {
                menuNum: "1",
                menuName: "系统设置",
                funcList: [
                    {
                        funcNum: "1",
                        funcName: "菜单管理",
                        funcLink: "/dashboard/menu"
                    },
                    {
                        funcNum: "2",
                        funcName: "角色管理",
                        funcLink: "/dashboard/role"
                    },
                    {
                        funcNum: "3",
                        funcName: "用户管理",
                        funcLink: "/dashboard/user"
                    },
                    {
                        funcNum: "4",
                        funcName: "区域管理",
                        funcLink: "/dashboard/region"
                    }
                ]
            },
            {
                menuNum: "0",
                menuName: "业务设置",
                funcList: [
                    {
                        funcNum: "1",
                        funcName: "供应商管理",
                        funcLink: "/dashboard/supplier/supplierlist"
                    },
                    {
                        funcNum: "2",
                        funcName: "商品管理",
                        funcLink: "/dashboard/goods"
                    },
                    {
                        funcNum: "3",
                        funcName: "套餐管理",
                        funcLink: "/dashboard/suite"
                    },
                    {
                        funcNum: "4",
                        funcName: "客户订单",
                        funcLink: "/dashboard/order"
                    },
                    {
                        funcNum: "5",
                        funcName: "商户订单",
                        funcLink: "/dashboard/shoporder"
                    },
                    {
                        funcNum: "5",
                        funcName: "店主中心",
                        funcLink: "/dashboard/shoppercenter"
                    },
                    {
                        funcNum: "6",
                        funcName: "配送员中心",
                        funcLink: "/dashboard/couriercenter"
                    }
                ]
            },{
                menuNum: "2",
                menuName: "报表中心",
                funcList: [
                    {
                        funcNum: "1",
                        funcName: "日报表",
                        funcLink: "/dashboard/dailyreport"
                    }
                ]
            }
        ]//菜单列表
    }
}

//Agent角色管理
var AgentRoleData = {
    roleDes: "区域代理",
    roleName: constants.role.agent,//管理员角色
    menuList: [
        {
            menuNum: "0",
            menuName: "业务管理",
            funcList: [
                {
                    funcNum: "1",
                    funcName: "供应商管理",
                    funcLink: "/dashboard/supplier/supplierlist"
                },
                {
                    funcNum: "2",
                    funcName: "商品管理",
                    funcLink: "/dashboard/goods"
                },
                {
                    funcNum: "3",
                    funcName: "套餐管理",
                    funcLink: "/dashboard/suite"
                },
                {
                    funcNum: "4",
                    funcName: "客户订单",
                    funcLink: "/dashboard/order"
                },
                {
                    funcNum: "5",
                    funcName: "商户订单",
                    funcLink: "/dashboard/shoporder"
                },
                {
                    funcNum: "6",
                    funcName: "配送员中心",
                    funcLink: "/dashboard/couriercenter"
                }
            ]
        },{
                menuNum: "2",
                menuName: "报表中心",
                funcList: [
                    {
                        funcNum: "1",
                        funcName: "日报表",
                        funcLink: "/dashboard/dailyreport"
                    }
                ]
            }
    ]//菜单列表

}
//shop owner 
var ShopperRoleData = {
    roleDes: "店主",
    roleName: constants.role.shopper,//管理员角色
    menuList: [
        {
            menuNum: "0",
            menuName: "店主菜单",
            funcList: [
                {
                    funcNum: "1",
                    funcName: "店主中心",
                    funcLink: "/dashboard/shoppercenter"
                }
            ]
        }
    ]//菜单列表
}

//courier  
var CourierRoleData = {
    roleDes: "配送员",
    roleName: constants.role.courier,//管理员角色
    menuList: [
        {
            menuNum: "0",
            menuName: "配送员菜单",
            funcList: [
                {
                    funcNum: "1",
                    funcName: "配送员中心",
                    funcLink: "/dashboard/couriercenter"
                }
            ]
        }
    ]//菜单列表
}

var initData = function () {
    async.waterfall([
        //创建全局的一个区域给管理员关联
        function (callback) {
            initGlobalDistrict(function (districtId) {
                callback(null, districtId);
            });
        },
        //创建管理员
        function (districtId, callback) {
            //初始化系统管理员用户
            initAdminUser(districtId, function () {
                callback(null, true)
            });//这个callback就时上面一行的callback，该callback时async waterfall中的，有两个参数    
        },
        function (initadminresult, callback) {
            //初始化区域代理AGENT菜单的初始化
            initAgentRole(AgentRoleData, function () {
                callback(null, true)
            });

        },
        function (initaAgentroleresult, callback) {
            //初始化店主菜单的初始化
            initAgentRole(ShopperRoleData, function () {
                callback(null, true)
            });

        },
        function (initShopperRoleDataresult, callback) {
            //初始化配送员菜单的初始化
            initAgentRole(CourierRoleData, function () {
                callback(null, true)
            });
        }
    ], function (err, result) {
        if (err) console.log(err);
        console.log("管理员、代理、店主、配送员相关初始数据创建成功！")
    })

}

//初始化新建一个全局的区域给管理员使用
var initGlobalDistrict = function (callback) {
    var GlobaleDistrict = new districtModel({
        province: "全局",
        city: "全局",
        district: "全局"
    })
    districtModel.findOne({
        province: "全局",
        city: "全局",
        district: "全局"
    })
        .exec(function (err, districtResult) {
            if (err) console.log(err);
            if (!districtResult) {
                //创建该区域
                GlobaleDistrict.save(function (err, districtSaveResult) {
                    if (err) console.log(err);
                    if (districtSaveResult) {
                        console.log("创建全局区域成功！")
                        callback(districtSaveResult._id);
                    }
                })
            } else {
                console.log("该全局区域已经存在！")
                callback(districtResult._id);
            }

        })
}

//初始化系统管理员用户，系统所有功能也都是通过该函数进行创建
var initAdminUser = function (districtId, callback) {
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
                                                                    console.log("功能:[" + itemfuncValue.funcName + "]" + "创建成功！")
                                                                    callback1();
                                                                }
                                                            })
                                                        }
                                                    })
                                            }, function (err) {
                                                //---------------------------------------menucreate
                                                var menuInstance = new menuModel({
                                                    menuNum: itemmenuValue.menuNum,
                                                    menuName: itemmenuValue.menuName,
                                                    funcList: funclistTemp
                                                })
                                                menuInstance.save(function (err, menuSaveResult) {
                                                    if (err) console.log(err);
                                                    if (menuSaveResult) {
                                                        menulisttemp.push(menuSaveResult._id);
                                                        console.log("菜单:[" + itemmenuValue.menuName + "]" + "创建成功！")
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
                                        roleDes: "系统管理员职责",
                                        roleName: constants.role.admin,
                                        menuList: menulisttemp
                                    }
                                )
                                roleInstance.save(function (err, roleSaveResult) {
                                    if (err) console.log(err)
                                    if (roleSaveResult) {
                                        console.log("角色:[" + constants.role.admin + "]" + "创建成功！")
                                        var userInstance = new userModel({
                                            username: UserData.userName,
                                            nickname: UserData.nickname,
                                            mobile: UserData.mobile,
                                            password: bcrypt.hashSync(UserData.password, salt),
                                            openid: UserData.openid,
                                            role: roleSaveResult._id,
                                            district: districtId

                                        })

                                        userInstance.save(function (err, userSaveResult) {
                                            if (err) console.log(err);

                                            if (userSaveResult) {
                                                //管理员用户创建结束
                                                callback();
                                                console.log("用户:[" + userSaveResult.username + "]" + "创建成功！")
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

// 初始化agent角色，以及旗下菜单
var initAgentRole = function (RoleData, callback9) {
    async.waterfall([
        //新建agent下面的菜单
        function (callback) {
            //循环检查roledata下面的菜单是否已经创建
            var menulist = [];
            async.each(RoleData.menuList, function (menuitem, callback1) {
                //对menuitem进行检查是否已经创建，如果没创建就进行创建
                menuModel.findOne({ menuName: menuitem.menuName })
                    .exec(function (err, menuResult) {
                        if (err) console.log(err)
                        if (!menuResult) {
                            //创建该menu
                            //1.查询该menuitem下面的预制功能列表，构造funcid数组
                            var funclist = [];
                            async.each(menuitem.funcList, function (funcitem, callback2) {
                                funcModel.findOne({ funcName: funcitem.funcName })
                                    .exec(function (err, funcResult) {
                                        if (err) console.log(err);
                                        if (!funcResult) {
                                            callback2('为agent设置的功能，系统内尚未创建，请核对管理员初始化时的功能名称！')
                                        } else {
                                            funclist.push(funcResult._id);
                                            callback2();
                                        }
                                    })

                            }, function (err) {
                                if (err) console.log(err);
                                //2.1中已经完成改menuitem下面的funclist创建，这里开始创建menu
                                var menuInstance = new menuModel({
                                    menuNum: menuitem.menuNum,
                                    menuName: menuitem.menuName,
                                    funcList: funclist
                                })
                                menuInstance.save(function (err, menuSaveResult) {
                                    if (err) console.log(err);
                                    if (menuSaveResult) {
                                        menulist.push(menuSaveResult._id);
                                        callback1();
                                    }
                                })
                            })
                        } else {
                            //已经有该menu,就把改menu的id放进到menulist中去
                            console.log(menuResult.menuName + "已经创建！")
                            menulist.push(menuResult._id);
                            callback1()
                        }
                    })
            }, function (err) {
                if (err) console.log(err);
                callback(null, menulist);
            })
        },
        //创建agent角色
        function (menulist, callback) {
            roleModel.findOne({ roleName: RoleData.roleName })
                .exec(function (err, roleResult) {
                    if (err) console.log(err);
                    if (!roleResult) {
                        //创建改角色
                        var roleInstance = new roleModel({
                            roleName: RoleData.roleName,
                            roleDes: RoleData.roleDes,
                            menuList: menulist
                        })
                        roleInstance.save(function (err, roleResult) {
                            if (err) console.log(err);
                            if (roleResult) {
                                callback(null, true);
                            }
                        })
                    } else {
                        callback("该角色已经存在！")
                    }
                })

        }
    ], function (err, result) {
        if (err) {
            console.log("err.message:" + err.message);
        } else {
            callback9();
            console.log("角色创建成功！")
        }
    }
    )
}


//对比setSchedule中和creaeMenu的getApiToken的调用，可以看到不同的回调的使用。
var setSchedule = function () {
    // console.log("开始定时任务")
    // wechatApi.getApiToken(function () {
    //     console.log("定时任务获取apitoken")
    // });

    var rule2 = new schedule.RecurrenceRule();
    // var times2    = [1,3,5,7,9,11,13,15,17,19,21,23];  
    rule2.minute = 1;
    schedule.scheduleJob(rule2, function () {
        console.log('定时任务:' + new Date());
        wechatApi.getApiToken(function () {
            console.log("定时任务获取apitoken")
            this.initTagAndMenu();
        });
    });
}


//初始化分组、菜单
var initTagAndMenu = function () {
    if (!config.apiToken) {
        wechatApi.getApiToken(function () {
            //创建分组，在回调中定义菜单
            wechatApi.InitTag(wechatApi.initMenu);
        })
    }
    else {
        wechatApi.InitTag(wechatApi.initMenu);
    }
}



module.exports = {
    initData,
    setSchedule,
    initTagAndMenu
};





