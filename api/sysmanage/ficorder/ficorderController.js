var ficorderModel = require('./ficorderModel.js');
var moment = require('moment');
var wechatapi = require('../../common/wechatapi');
var courierModel = require('../courier/courierModel');

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
    }
};
