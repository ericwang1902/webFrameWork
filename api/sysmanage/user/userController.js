var userModel = require('./userModel.js');
var bcrypt = require('bcryptjs');//数据加密
var salt = bcrypt.genSaltSync(10);
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
        userModel
            .find()
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
                    options: { sort: {menuNum:1} },
                    model: "menu",
                    populate: {
                        path: "funcList",
                        select: "_id funcNum funcName funcLink",
                        options: { sort: {funcNum:1} },
                        model: "func"
                    }

                }
            })
            .exec(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                console.log(JSON.stringify(user))
                return res.json(user);
            })
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var userInstance = req.body;
        var roleListTemp = [];

        for(var i =0;i<userInstance.roleSelection.length;i++){
            roleListTemp.push(userInstance.roleSelection[i]._id);
        }



        var user = new userModel({
            username: userInstance.userName,
            mobile: userInstance.userName,
            nickname:userInstance.nickName,
            password: bcrypt.hashSync(userInstance.passWord, salt),
            openid: "",
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

        console.log(req.params.id)
        console.log(req.body);

        var id = req.params.id;

        var roleSelection = req.body.roleSelection ? req.body.roleSelection: [];
        var roleList =[];
        if(roleSelection.length!=0){
            for(var i=0;i<roleSelection.length;i++){
                roleList.push(roleSelection[i]._id);
            }
        }else{
            roleList=null;
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
            user.mobile = req.body.userName ? req.body.userName : user.mobile;
            user.nickname = req.body.nickname ? req.body.nickname :user.nickname;
            user.password =  req.body.passWord ? bcrypt.hashSync(req.body.passWord) : user.password;
            user.openid = req.body.openid ? req.body.openid : user.openid;
            user.role = roleList ? roleList : user.role;

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
    }
};
