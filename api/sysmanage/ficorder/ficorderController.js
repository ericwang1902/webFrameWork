var ficorderModel = require('./ficorderModel.js');

/**
 * ficorderController.js
 *
 * @description :: Server-side logic for managing ficorders.
 */
module.exports = {

    /**
     * ficorderController.list()
     */
    list: function (req, res) {
        ficorderModel.find(function (err, ficorders) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ficorder.',
                    error: err
                });
            }
            return res.json(ficorders);
        });
    },

    /**
     * ficorderController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        ficorderModel.findOne({_id: id}, function (err, ficorder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ficorder.',
                    error: err
                });
            }
            if (!ficorder) {
                return res.status(404).json({
                    message: 'No such ficorder'
                });
            }
            return res.json(ficorder);
        });
    },

    /**
     * ficorderController.create()
     */
    create: function (req, res) {
        var ficorder = new ficorderModel({			ficordernum : req.body.ficordernum,			ficorderstate : req.body.ficorderstate
        });

        ficorder.save(function (err, ficorder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating ficorder',
                    error: err
                });
            }
            return res.status(201).json(ficorder);
        });
    },

    /**
     * ficorderController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        ficorderModel.findOne({_id: id}, function (err, ficorder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ficorder',
                    error: err
                });
            }
            if (!ficorder) {
                return res.status(404).json({
                    message: 'No such ficorder'
                });
            }

            ficorder.ficordernum = req.body.ficordernum ? req.body.ficordernum : ficorder.ficordernum;			ficorder.ficorderstate = req.body.ficorderstate ? req.body.ficorderstate : ficorder.ficorderstate;			
            ficorder.save(function (err, ficorder) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating ficorder.',
                        error: err
                    });
                }

                return res.json(ficorder);
            });
        });
    },

    /**
     * ficorderController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        ficorderModel.findByIdAndRemove(id, function (err, ficorder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the ficorder.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
