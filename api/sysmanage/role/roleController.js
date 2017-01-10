var roleModel = require('./roleModel.js');

/**
 * roleController.js
 *
 * @description :: Server-side logic for managing roles.
 */
module.exports = {

    /**
     * roleController.list()
     */
    list: function (req, res) {
        roleModel
            .find()
            .populate({
                path: 'menuList',//字段
                select: '_id menuName funcList',
                model: 'menu',//字段对应的model
                //下面这个是在上面path、select、model基础上的，上面返回的是{menuName,funcList},下面的对该返回对象进行populate
                populate: {
                    path: 'funcList',
                    select: '_id funcName funcLink',
                    model: 'func'
                }
            }
            )
            .exec(function (err, roles) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting role.',
                        error: err
                    });
                }
                return res.json(roles);
            })

    },

    /**
     * roleController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        roleModel
            .find({_id:id})
            .populate({
                path: 'menuList',//字段
                select: '_id menuName funcList',
                model: 'menu',//字段对应的model
                //下面这个是在上面path、select、model基础上的，上面返回的是{menuName,funcList},下面的对该返回对象进行populate
                populate: {
                    path: 'funcList',
                    select: '_id funcName funcLink',
                    model: 'func'
                }
            }
            )
            .exec(function (err, roles) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting role.',
                        error: err
                    });
                }
                return res.json(roles);
            })
    },

    /**
     * roleController.create()
     */
    create: function (req, res) {
        var role = new roleModel({
            roleName: req.body.roleName,
            menuList: req.body.menuList
        });

        role.save(function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating role',
                    error: err
                });
            }
            return res.status(201).json(role);
        });
    },

    /**
     * roleController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        roleModel.findOne({ _id: id }, function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting role',
                    error: err
                });
            }
            if (!role) {
                return res.status(404).json({
                    message: 'No such role'
                });
            }

            role.roleName = req.body.roleName ? req.body.roleName : role.roleName;
            role.menuList = req.body.menuList ? req.body.menuList : role.menuList;

            role.save(function (err, role) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating role.',
                        error: err
                    });
                }

                return res.json(role);
            });
        });
    },

    /**
     * roleController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        roleModel.findByIdAndRemove(id, function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the role.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
