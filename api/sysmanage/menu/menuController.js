var menuModel = require('./menuModel.js');

/**
 * menuController.js
 *
 * @description :: Server-side logic for managing menus.
 */
module.exports = {

    /**
     * menuController.list()
     */
    list: function (req, res) {
        menuModel.find(function (err, menus) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting menu.',
                    error: err
                });
            }
            return res.json(menus);
        });
    },

    /**
     * menuController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        menuModel.findOne({_id: id}, function (err, menu) {
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
        });
    },

    /**
     * menuController.create()
     */
    create: function (req, res) {
        var menu = new menuModel({			menuName : req.body.menuName,			functionList : req.body.functionList
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
     * menuController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        menuModel.findOne({_id: id}, function (err, menu) {
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

            menu.menuName = req.body.menuName ? req.body.menuName : menu.menuName;			menu.functionList = req.body.functionList ? req.body.functionList : menu.functionList;			
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
     * menuController.remove()
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
