var shoporderModel = require('./shoporderModel.js');
var moment = require('moment');
var constants = require('../../frameConfig/constants')
var async = require('async');
var wechatapi = require('../../common/wechatapi');
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
        //构造查询条件，admin例外
        var role = req.user.role[0].roleName;
        var districtId = req.user.district._id;
        var conditions = {};
        console.log(role);
        if (role == 'ADMIN') {
            conditions = {}
        } else {
            conditions = { district: districtId }
        }

        shoporderModel.find(conditions)
            .populate({
                path: 'district',
                model: 'district'
            })
            .populate({
                path: 'ficorder',
                model: 'ficorder'
            })
            .populate({
                path: 'supplier',
                model: 'supplier'
            })
            .sort({ 'ordertime': -1 })
            .exec(function (err, shoporders) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting shoporder.',
                        error: err
                    });
                }
                return res.json(shoporders);
            })


    },

    /**
     * shoporderController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        shoporderModel.findOne({ _id: id }, function (err, shoporder) {
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
        var shoporder = new shoporderModel({
            ordernum: 'S' + moment().format('YYYYMMDDHHmmssSSS'),
            goodslist: req.body.goodslist,
            district: req.body.district,
            ordertime: moment(),//订单生成时间
            preparetime: req.body.preparetime,
            finishtime: req.body.finishtime,
            picktime: req.body.picktime,
            receivetime: req.body.receivetime,
            ficorder: req.body.ficorder,
            supplier: req.body.supplier
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
        shoporderModel.findOne({ _id: id }, function (err, shoporder) {
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

            shoporder.ordernum = req.body.ordernum ? req.body.ordernum : shoporder.ordernum;
            shoporder.goodslist = req.body.goodslist ? req.body.goodslist : shoporder.goodslist;
            shoporder.ordertime = req.body.ordertime ? req.body.ordertime : shoporder.ordertime;
            shoporder.preparetime = req.body.preparetime ? req.body.preparetime : shoporder.preparetime;
            shoporder.finishtime = req.body.finishtime ? req.body.finishtime : shoporder.finishtime;
            shoporder.picktime = req.body.picktime ? req.body.picktime : shoporder.picktime;
            shoporder.receivetime = req.body.receivetime ? req.body.receivetime : shoporder.receivetime;
            shoporder.ficorder = req.body.ficorder ? req.body.ficorder : shoporder.ficorder;
            shoporder.supplier = req.body.supplier ? req.body.supplier : shoporder.supplier;
            shoporder.district = req.body.district ? req.body.district : shoporder.district;

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
    },
    //分发订单时，批量创建商铺订单的接口
    pcreate: function (req, res) {
        var shoporderlist = req.body.shoporderlist;
        // console.log(shoporderlist);

        async.each(shoporderlist, function (shoporder, callback) {
            var shoporder = new shoporderModel(
                {
                    ordernum: 'S' + moment().format('YYYYMMDDHHmmssSSS'),
                    goodslist: shoporder.goodslist,
                    district: shoporder.district,
                    ordertime: moment(),//订单生成时间
                    preparetime: '',
                    finishtime: '',
                    picktime: '',
                    receivetime: '',
                    ficorder: shoporder.ficorder,
                    supplier: shoporder.supplier
                }
            );

            shoporder.save(function (err, result) {
                if (err) {
                    console.log(err);
                    callback(err);
                }
                //查询result的通知
                shoporderModel.findOne({ _id: result._id })
                    .populate({
                        path: 'district',
                        model: 'district'
                    })
                    .populate({
                        path: 'ficorder',
                        model: 'ficorder'
                    })
                    .populate({
                        path: 'supplier',
                        model: 'supplier',
                        populate: {
                            path: 'supplieruser',
                            model: 'user',
                        }
                    })
                    .exec(function (err, shoporderres) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        }
                        console.log("----------------------------------")
                        console.log(JSON.stringify(shoporderres))
                        //发送订单通知
                        wechatapi
                            .sendNewOrderTemplateMsg(shoporderres.supplier.supplieruser.openid,
                            shoporderres,
                            function () {
                                callback();
                            });


                    })



            })

        }, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error when creating the shoporder.',
                    error: err
                });
            } else {
                console.log("shoporder都存储了！");
                return res.status(201).json({ result: 'success' });
            }
        })

    },
    //根据店主id，即supplier来获取店铺订单的数据
    mshoporderforsupplier: function (req, res) {
        var supplierid = req.body.supplierid;

        var conditions = {
            supplier: supplierid
        }

        shoporderModel.find(conditions)
            .populate({
                path: 'district',
                model: 'district'
            })
            .populate({
                path: 'ficorder',
                model: 'ficorder'
            })
            .populate({
                path: 'supplier',
                model: 'supplier'
            })
            .sort({ 'ordertime': -1 })
            .exec(function (err, shoporders) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting shoporder.',
                        error: err
                    });
                }
                return res.json(shoporders);
            })


    }
};
