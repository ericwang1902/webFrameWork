var menuModel = require('./menuModel.js');

/**
 * menuController.js
 *
 * @description :: Server-side logic for managing menus.
 */
module.exports = {

    /**
     * 查看所有菜单列表
     */
    list: function (req, res) {
        menuModel
            .find()
           // .populate("funcList")
            .exec(function (err, menus) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting menu.',
                        error: err
                    })
                }
                return res.json(menus);
            });
    },

    /**
     * 查询单个菜单,populate funcList
     */
    show: function (req, res) {
        var id = req.params.id;
        menuModel
            .findOne({ _id: id })
            //.populate("funcList")
            .exec(function (err, menuResult) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting menu.',
                        error: err
                    });
                }

                if (!menu) {
                    return res.status(404).json({
                        message: 'No such menu'
                    });
                }

                return res.json(menu);

            })
    },

    /**
     * 创建菜单
     */
    create: function (req, res) {
        var menu = new menuModel({
            menuName: req.body.menuName,
            funcList: req.body.funcList//这是func的objectId的array
        });

        menu.save(function (err, menu) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating menu',
                    error: err
                });
            }
            return res.status(201).json(menu);
        });
    },

    /**
     * 更新菜单
     */
    update: function (req, res) {
        var id = req.params.id;
        menuModel.findOne({ _id: id }, function (err, menu) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting menu',
                    error: err
                });
            }
            if (!menu) {
                return res.status(404).json({
                    message: 'No such menu'
                });
            }

            menu.menuName = req.body.menuName ? req.body.menuName : menu.menuName;
            menu.funcList = req.body.funcList ? req.body.funcList : menu.funcList;

            menu.save(function (err, menu) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating menu.',
                        error: err
                    });
                }

                return res.json(menu);
            });
        });
    },

    /**
     * 删除菜单
     */
    remove: function (req, res) {
        var id = req.params.id;
        menuModel.findByIdAndRemove(id, function (err, menu) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the menu.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
