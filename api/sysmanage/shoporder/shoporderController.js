var shoporderModel = require('./shoporderModel.js');

/**
 * shoporderController.js
 *
 * @description :: Server-side logic for managing shoporders.
 */
module.exports = {

    /**
     * shoporderController.list()
     */
    list: function (req, res) {
        shoporderModel.find(function (err, shoporders) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting shoporder.',
                    error: err
                });
            }
            return res.json(shoporders);
        });
    },

    /**
     * shoporderController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        shoporderModel.findOne({_id: id}, function (err, shoporder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting shoporder.',
                    error: err
                });
            }
            if (!shoporder) {
                return res.status(404).json({
                    message: 'No such shoporder'
                });
            }
            return res.json(shoporder);
        });
    },

    /**
     * shoporderController.create()
     */
    create: function (req, res) {
        var shoporder = new shoporderModel({			ordernum : req.body.ordernum,			goodslist : req.body.goodslist,			ordertime : req.body.ordertime,			preparetime : req.body.preparetime,			finishtime : req.body.finishtime,			picktime : req.body.picktime,			receivetime : req.body.receivetime,			ficorder : req.body.ficorder,			supplierid : req.body.supplierid
        });

        shoporder.save(function (err, shoporder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating shoporder',
                    error: err
                });
            }
            return res.status(201).json(shoporder);
        });
    },

    /**
     * shoporderController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        shoporderModel.findOne({_id: id}, function (err, shoporder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting shoporder',
                    error: err
                });
            }
            if (!shoporder) {
                return res.status(404).json({
                    message: 'No such shoporder'
                });
            }

            shoporder.ordernum = req.body.ordernum ? req.body.ordernum : shoporder.ordernum;			shoporder.goodslist = req.body.goodslist ? req.body.goodslist : shoporder.goodslist;			shoporder.ordertime = req.body.ordertime ? req.body.ordertime : shoporder.ordertime;			shoporder.preparetime = req.body.preparetime ? req.body.preparetime : shoporder.preparetime;			shoporder.finishtime = req.body.finishtime ? req.body.finishtime : shoporder.finishtime;			shoporder.picktime = req.body.picktime ? req.body.picktime : shoporder.picktime;			shoporder.receivetime = req.body.receivetime ? req.body.receivetime : shoporder.receivetime;			shoporder.ficorder = req.body.ficorder ? req.body.ficorder : shoporder.ficorder;			shoporder.supplierid = req.body.supplierid ? req.body.supplierid : shoporder.supplierid;			
            shoporder.save(function (err, shoporder) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating shoporder.',
                        error: err
                    });
                }

                return res.json(shoporder);
            });
        });
    },

    /**
     * shoporderController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        shoporderModel.findByIdAndRemove(id, function (err, shoporder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the shoporder.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
