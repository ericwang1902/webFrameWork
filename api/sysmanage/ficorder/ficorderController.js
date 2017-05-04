var ficorderModel = require('./ficorderModel.js');
var moment = require('moment');
var wechatapi = require('../../common/wechatapi');
var courierModel = require('../courier/courierModel');
var orderModel = require('../order/orderModel');
var async = require('async');
var fansModel = require('../fans/fansModel');

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
        ficorderModel.findOne({ _id: id }, function (err, ficorder) {
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
        console.log(req.body);
        //region从前台取
        var region = req.body.region;

        var ficorder = new ficorderModel({
            ficordernum: 'F' + moment().format('YYYYMMDDHHmmssSSS'),
            ficorderstate: req.body.ficorderstate,
            region: region
        });

        ficorder.save(function (err, ficorder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating ficorder',
                    error: err
                });
            }
            //根据orgion 查找courier
            courierModel.findOne({ region: region })
                .populate({
                    path: 'district',
                    model: 'district'
                })
                .populate({
                    path: 'region',
                    model: 'region'
                })
                .populate({
                    path: 'courieruser',
                    model: 'user'
                })
                .exec(function (err, courier) {
                    if (err) {
                        console.log(err);
                    }
                    var openid = courier.courieruser.openid;

                    //发送新订单提醒给配送员
                    wechatapi.sendMsgToCourier(openid, ficorder, () => { return res.status(201).json(ficorder); });


                })


        });
    },

    /**
     * ficorderController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        ficorderModel.findOne({ _id: id }, function (err, ficorder) {
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

            ficorder.ficordernum = req.body.ficordernum ? req.body.ficordernum : ficorder.ficordernum;
            ficorder.ficorderstate = req.body.ficorderstate ? req.body.ficorderstate : ficorder.ficorderstate;
            ficorder.region = req.body.region ? req.body.region : ficorder.region;

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
    },
    //根据regionid获取ficorder
    ficorderByRegion: function (req, res) {
        var regionid = req.query.regionid;
        var ficorderstate = req.query.ficorderstate;

        var pageitems = parseInt(req.query.pageitems);
        var currentpage = parseInt(req.query.currentpage);

        var conditions = {
            region: regionid,
            ficorderstate: ficorderstate
        }
        async.series([
            function (callback) {
                ficorderModel.count(conditions, function (err, count) {
                    if (err) callback("order count出错");
                    callback(null, count);
                })
            },
            function (callback) {
                ficorderModel.find(conditions)
                    .exec(function (err, ficordersRes) {
                        callback(null, orderlist);
                    })
            }
        ], function (err, results) {
            var orderResult = {
                count: results[0],
                ficorders: results[1]
            }

            if (err) {
                return res.status(500).json({
                    message: 'Error when getting the order.',
                    error: err
                });
            }
            return res.json(orderResult);
        })


    },
    //根据ficorderid来更新ficorder的状态
    updateficstate(req, res) {
        var ficid = req.body.ficorder;
        var updatestate = req.body.targetstate;


        ficorderModel.findOne({ _id: ficid })
            .exec(function (err, ficorder) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting ficorder.',
                        error: err
                    });
                }
                ficorder.ficorderstate = updatestate ? updatestate : ficorder.ficorderstate;

                ficorder.save(function (err, ficorder) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating ficorder.',
                            error: err
                        });
                    }
                    //根据ficorder找order，根据order找fanid，根据fanid找openid
                    orderModel.find({ ficorder: ficorder._id })
                        .populate({
                            path: 'ficorder',
                            model: 'ficorder'
                        })
                        .exec(function (err, orders) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when updating ficorder.',
                                    error: err
                                });
                            }
                            async.each(orders, function (order, callback) {
                                fansModel.findById({ _id: order.fanid })
                                    .exec(function (err, fans) {
                                        if (err) {
                                            console.log(err)
                                            callback(err);
                                        }

                                        //发送订单通知
                                        wechatapi
                                            .sendOrderStateTemplateMsg(fans.fanopenid,
                                            order,
                                            function () {
                                                callback();
                                            });

                                    })
                            }, function (err) {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Error when updating ficorder.',
                                        error: err
                                    });
                                } else {
                                    return res.json(ficorder);
                                }
                            })


                        })
                });

            })
    }

};
