var userModel = require('./userModel.js');

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
                selcet: "_id roleName menuList",
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
        var user = new userModel({
            username: req.body.username,
            mobile: req.body.mobile,
            password: req.body.password,
            openid: req.body.openid,
            role: req.body.role
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
        var id = req.params.id;
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

            user.username = req.body.username ? req.body.username : user.username;
            user.mobile = req.body.mobile ? req.body.mobile : user.mobile;
            user.password = req.body.password ? req.body.password : user.password;
            user.openid = req.body.openid ? req.body.openid : user.openid;
            user.role = req.body.role ? req.body.role : user.role;

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
