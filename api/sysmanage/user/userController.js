var userModel = require('./userModel.js');
var bcrypt = require('bcryptjs');//数据加密
var salt = bcrypt.genSaltSync(10);
var wechatapi = require('../../common/wechatapi');
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        //构造查询条件，admin例外
        var role = req.user.role[0].roleName;
        var districtId = req.user.district._id;
        var conditions = {};
        console.log(role);
        if (role == 'ADMIN') {
            conditions = {}
        } else {
            conditions = { district: districtId }
        }

        userModel
            .find(conditions)
            .populate({
                path: "role",
                select: "_id roleName menuList",
                model: "role",
                populate: {
                    path: "menuList",
                    select: "_id menuName funcList",
                    model: "menu",
                    populate: {
                        path: "funcList",
                        select: "_id funcName funcLink",
                        model: "func"
                    }

                }
            }
            )
            .populate({
                path: "district",
                model: "district"
            })
            .exec(function (err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                return res.json(users);
            })


    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        userModel
            .findOne({ _id: id })
            .populate({
                path: "role",//usermodel里的属性名
                selcet: "_id roleName menuList",
                model: "role",//path对应的model名
                populate: {
                    path: "menuList",
                    select: "_id menuName funcList",
                    options: { sort: { menuNum: 1 } },
                    model: "menu",
                    populate: {
                        path: "funcList",
                        select: "_id funcNum funcName funcLink",
                        options: { sort: { funcNum: 1 } },
                        model: "func"
                    }

                }
            })
            .populate({
                path: "district",
                model: "district"
            })
            .exec(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                //console.log(JSON.stringify(user))
                return res.json(user);
            })
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var userInstance = req.body;
        console.log("~~~~~~~~~~~~~~~~~~~" + JSON.stringify(userInstance))
        var roleListTemp = [];

        for (var i = 0; i < userInstance.roleSelection.length; i++) {
            roleListTemp.push(userInstance.roleSelection[i]._id);
        }



        var user = new userModel({
            username: userInstance.userName,
            mobile: userInstance.mobile,
            nickname: userInstance.nickName,
            password: bcrypt.hashSync(userInstance.passWord, salt),
            openid: "",
            district: userInstance.district,
            role: roleListTemp
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }
            return res.status(201).json(user);
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {

        //console.log(req.params.id)
        //console.log(req.body);

        var id = req.params.id;

        var roleSelection = req.body.roleSelection ? req.body.roleSelection : [];
        var roleList = [];
        if (roleSelection.length != 0) {
            for (var i = 0; i < roleSelection.length; i++) {
                roleList.push(roleSelection[i]._id);
            }
        } else {
            roleList = null;
        }


        userModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.userName ? req.body.userName : user.username;
            user.mobile = req.body.mobile ? req.body.mobile : user.mobile;
            user.nickname = req.body.nickName ? req.body.nickName : user.nickname;
            user.password = req.body.passWord ? bcrypt.hashSync(req.body.passWord) : user.password;
            user.openid = req.body.openid ? req.body.openid : user.openid;
            user.role = roleList ? roleList : user.role;
            user.district = req.body.district ? req.body.district : user.district;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        userModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    /*
    user bind
    */
    userbind: function (req, res) {
        var usernamev = req.body.username;
        console.log(req.body);
        userModel.findOne({ username: usernamev })
            .exec(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user',
                        error: err
                    });
                }
                if (!user) {
                    return res.status(404).json({
                        message: 'No such user'
                    });
                }
                user.openid = req.body.openid ? req.body.openid : user.openid;

                user.save(function (err, saveduser) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating user.',
                            error: err
                        });
                    }
                    //查询用户的信息返回给客户端
                    var id = saveduser._id;
                    userModel
                        .findOne({ _id: id })
                        .populate({
                            path: "role",//usermodel里的属性名
                            selcet: "_id roleName menuList",
                            model: "role",//path对应的model名
                            populate: {
                                path: "menuList",
                                select: "_id menuName funcList",
                                options: { sort: { menuNum: 1 } },
                                model: "menu",
                                populate: {
                                    path: "funcList",
                                    select: "_id funcNum funcName funcLink",
                                    options: { sort: { funcNum: 1 } },
                                    model: "func"
                                }

                            }
                        })
                        .populate({
                            path: "district",
                            model: "district"
                        })
                        .exec(function (err, user) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when getting user.',
                                    error: err
                                });
                            }
                            wechatapi.setfanstag(user.openid, user.role[0].roleName, function () {
                                return res.json(user);
                            })

                        })
                });
            })
    },
    //根据openid获取用户信息返回
    muser: function (req, res) {
        var openid = req.query.openid;
        //不可以一个微信绑定多的角色
        userModel.findOne({ openid: openid })
            .populate({
                path: "role",//usermodel里的属性名
                selcet: "_id roleName menuList",
                model: "role",//path对应的model名
                populate: {
                    path: "menuList",
                    select: "_id menuName funcList",
                    options: { sort: { menuNum: 1 } },
                    model: "menu",
                    populate: {
                        path: "funcList",
                        select: "_id funcNum funcName funcLink",
                        options: { sort: { funcNum: 1 } },
                        model: "func"
                    }

                }
            })
            .populate({
                path: "district",
                model: "district"
            })
            .exec(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                //console.log(JSON.stringify(user))
                return res.json(user);
            })
    }
};
