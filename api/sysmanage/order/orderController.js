var orderModel = require('./orderModel.js');
var moment = require('moment');
var constants = require('../../frameConfig/constants')
var async = require('async');

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
        //构造查询条件，admin例外
        var role = req.user.role[0].roleName;
        var districtId = req.user.district._id;
        var conditions = {};
        console.log(role);
        if (role == 'ADMIN') {
            if (!req.query.delivered) {//没有分发的客户订单
                conditions = { region: req.query.region, ficorder: { $exists: false } }
            } else {//已经分发的客户订单
                conditions = { region: req.query.region, ficorder: { $exists: true } }
            }
        } else {
            if (!req.query.delivered) {//没有分发的客户订单
                if (!req.query.region) {
                    conditions = { district: districtId, ficorder: { $exists: false } }
                } else {//已经分发的客户订单
                    conditions = { region: req.query.region, district: districtId, ficorder: { $exists: false } }
                }

            } else {
                if (!req.query.region) {
                    conditions = { district: districtId, ficorder: { $exists: true } }
                } else {
                    conditions = { region: req.query.region, district: districtId, ficorder: { $exists: true } }
                }
            }

        }

        orderModel.find(conditions)
            .populate({
                path: 'district',
                model: 'district'
            })
            .populate({
                path: 'region',
                model: 'region'
            })
            .populate({
                path: 'fanid',
                model: 'fans'
            })
            .populate({
                path: 'ficorder',
                model: 'ficorder'
            })
            .sort({ 'paytime': -1 })
            .exec(function (err, orders) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting order.',
                        error: err
                    });
                }
                return res.json(orders);
            })
    },

    /**
     * orderController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        orderModel.findOne({ _id: id }, function (err, order) {
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
        console.log("ordernum:" + moment().format('YYYYMMDDHHmmssSSS'));

        var order = new orderModel({
            ordernum: 'U' + moment().format('YYYYMMDDHHmmssSSS'),
            suitelist: req.body.suitelist,
            goodslist: req.body.goodslist,
            totalamount: req.body.totalamount,

            coupon: req.body.coupon,
            paytype: req.body.paytype,
            paystate: req.body.paystate,
            ordertime: moment(),//下单时间
            preparetime: req.body.preparetime,
            finishtime: req.body.finishtime,
            picktime: req.body.picktime,
            receivetime: req.body.receivetime,
            paytime: moment(),//支付时间
            fanid: req.body.fanid,
            district: req.body.district,
            region: req.body.region,
            address: req.body.address,
            note: req.body.note,
            ficorder: req.body.ficorder,
            taotalcount: req.body.taotalcount
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
        orderModel.findOne({ _id: id }, function (err, order) {
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

            order.ordernum = req.body.ordernum ? req.body.ordernum : order.ordernum;
            order.suitelist = req.body.suitelist ? req.body.suitelist : order.suitelist;
            order.goodslist = req.body.goodslist ? req.body.goodslist : order.goodslist;
            order.totalamount = req.body.totalamount ? req.body.totalamount : order.totalamount;
            order.coupon = req.body.coupon ? req.body.coupon : order.coupon;
            order.paytype = req.body.paytype ? req.body.paytype : order.paytype;
            order.paystate = req.body.paystate ? req.body.paystate : order.paystate;
            order.ordertime = req.body.ordertime ? req.body.ordertime : order.ordertime;
            order.preparetime = req.body.preparetime ? req.body.preparetime : order.preparetime;
            order.finishtime = req.body.finishtime ? req.body.finishtime : order.finishtime;
            order.picktime = req.body.picktime ? req.body.picktime : order.picktime;
            order.receivetime = req.body.receivetime ? req.body.receivetime : order.receivetime;
            order.paytime = req.body.paytime ? req.body.paytime : order.paytime;
            order.fanid = req.body.fanid ? req.body.fanid : order.fanid;
            order.district = req.body.district ? req.body.district : order.district,
                order.region = req.body.region ? req.body.region : order.reion,
                order.address = req.body.address ? req.body.address : order.address;
            order.note = req.body.note ? req.body.note : order.note;
            order.ficorder = req.body.ficorder ? req.body.ficorder : order.ficorder;
            order.taotalcount = req.body.taotalcount ? req.body.taotalcount : order.taotalcount;

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
    },
    //粉丝根据fanid获取订单列表的接口
    morderlistfan: function (req, res) {
        var fansid = req.query.fansid;

        orderModel.find({ fanid: fansid })
            .populate({
                path: 'district',
                model: 'district'
            })
            .populate({
                path: 'region',
                model: 'region'
            })
            .populate({
                path: 'fanid',
                model: 'fans'
            })
            .sort({ 'paytime': -1 })
            .exec(function (err, orderlist) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the order.',
                        error: err
                    });
                }
                return res.json(orderlist);
            })
    },
    //根据局域代理的districtid获取订单列表
    morderlistagent: function (req, res) {
        var districtid = req.query.districtid;
        var conditions = {};
        if (!req.query.delivered) {
            //如果没有分发
            conditions = { district: districtid, ficorder: { $exists: false } }
        } else {
            conditions = { district: districtid, ficorder: { $exists: true } }
        }
        
        if(req.query.all){
             conditions = { district: districtid }
        }

        orderModel.find(conditions)
            .populate({
                path: 'district',
                model: 'district'
            })
            .populate({
                path: 'region',
                model: 'region'
            })
            .populate({
                path: 'fanid',
                model: 'fans'
            })
            .sort({ 'paytime': -1 })
            .exec(function (err, orderlist) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the order.',
                        error: err
                    });
                }
                return res.json(orderlist);
            })
    },
    //

    //分发订单时，批量更新客户订单的ficorder
    pupdate: function (req, res) {
        var orderlist = req.body.orderlist;

        async.each(orderlist, function (order, callback) {
            orderModel.findOne({ _id: order._id })
                .exec(function (err, orderresult) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    }
                    orderresult.ficorder = order.ficorder;
                    orderresult.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        }

                        callback();
                    })
                })

        }, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error when updating the order.',
                    error: err
                });
            } else {
                console.log("order都更新了");
                return res.status(201).json({ result: 'success' });
            }
        })

    }

};

