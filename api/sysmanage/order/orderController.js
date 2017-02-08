var orderModel = require('./orderModel.js');

/**
 * orderController.js
 *
 * @description :: Server-side logic for managing orders.
 */
module.exports = {

    /**
     * orderController.list()
     */
    list: function (req, res) {
        orderModel.find(function (err, orders) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order.',
                    error: err
                });
            }
            return res.json(orders);
        });
    },

    /**
     * orderController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        orderModel.findOne({_id: id}, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order.',
                    error: err
                });
            }
            if (!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            }
            return res.json(order);
        });
    },

    /**
     * orderController.create()
     */
    create: function (req, res) {
        var order = new orderModel({			ordernum : req.body.ordernum,			suitelist : req.body.suitelist,			goodslist : req.body.goodslist,			totalamount : req.body.totalamount,			coupon : req.body.coupon,			paytype : req.body.paytype,			paystate : req.body.paystate,			ordertime : req.body.ordertime,			preparetime : req.body.preparetime,			finishtime : req.body.finishtime,			picktime : req.body.picktime,			receivetime : req.body.receivetime,			paytime : req.body.paytime,			fanid : req.body.fanid,			address : req.body.address,			note : req.body.note,			ficorder : req.body.ficorder
        });

        order.save(function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating order',
                    error: err
                });
            }
            return res.status(201).json(order);
        });
    },

    /**
     * orderController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        orderModel.findOne({_id: id}, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order',
                    error: err
                });
            }
            if (!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            }

            order.ordernum = req.body.ordernum ? req.body.ordernum : order.ordernum;			order.suitelist = req.body.suitelist ? req.body.suitelist : order.suitelist;			order.goodslist = req.body.goodslist ? req.body.goodslist : order.goodslist;			order.totalamount = req.body.totalamount ? req.body.totalamount : order.totalamount;			order.coupon = req.body.coupon ? req.body.coupon : order.coupon;			order.paytype = req.body.paytype ? req.body.paytype : order.paytype;			order.paystate = req.body.paystate ? req.body.paystate : order.paystate;			order.ordertime = req.body.ordertime ? req.body.ordertime : order.ordertime;			order.preparetime = req.body.preparetime ? req.body.preparetime : order.preparetime;			order.finishtime = req.body.finishtime ? req.body.finishtime : order.finishtime;			order.picktime = req.body.picktime ? req.body.picktime : order.picktime;			order.receivetime = req.body.receivetime ? req.body.receivetime : order.receivetime;			order.paytime = req.body.paytime ? req.body.paytime : order.paytime;			order.fanid = req.body.fanid ? req.body.fanid : order.fanid;			order.address = req.body.address ? req.body.address : order.address;			order.note = req.body.note ? req.body.note : order.note;			order.ficorder = req.body.ficorder ? req.body.ficorder : order.ficorder;			
            order.save(function (err, order) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating order.',
                        error: err
                    });
                }

                return res.json(order);
            });
        });
    },

    /**
     * orderController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        orderModel.findByIdAndRemove(id, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the order.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
