var courierModel = require('./courierModel.js');
var async = require('async');


/**
 * courierController.js
 *
 * @description :: Server-side logic for managing couriers.
 */
module.exports = {

    /**
     * courierController.list()
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

        var pageItems = Number(req.query.pageItems);
        var currentPage = Number(req.query.currentPage);

        async.series([
            function (callback) {
                courierModel.count(conditions, function (err, count) {
                    if (err) callback("courier count出错");
                    callback(null, count);
                })
            },
            function (callback) {
                courierModel.find(conditions)
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
                    .skip((currentPage - 1) * pageItems)
                    .limit(pageItems)
                    .exec(function (err, couriers) {
                        if (err) callback("couriers出错");
                        callback(null, couriers);
                    })
            }
        ], function (err, results) {
            
            var couriersResult={
                count:results[0],
                couriers:results[1]
            }

            if (err) {
                return res.status(500).json({
                    message: 'Error when getting courier.',
                    error: err
                });
            }
            
            return res.json(couriersResult);

        })





    },

    /**
     * courierController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        courierModel.findOne({ _id: id }, function (err, courier) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting courier.',
                    error: err
                });
            }
            if (!courier) {
                return res.status(404).json({
                    message: 'No such courier'
                });
            }
            return res.json(courier);
        });
    },

    /**
     * courierController.create()
     */
    create: function (req, res) {
        console.log(req.body);
        var role = req.user.role[0].roleName;
        var districtId = req.user.district._id;//取得当前登陆用户的区县信息
        var courier = new courierModel({
            couriername: req.body.couriername,
            courierdes: req.body.courierdes,
            district: req.body.district ? req.body.district : districtId,
            region: req.body.region,
            courieruser: req.body.courieruser
        });

        courier.save(function (err, courier) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating courier',
                    error: err
                });
            }
            return res.status(201).json(courier);
        });
    },

    /**
     * courierController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        courierModel.findOne({ _id: id }, function (err, courier) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting courier',
                    error: err
                });
            }
            if (!courier) {
                return res.status(404).json({
                    message: 'No such courier'
                });
            }

            courier.couriername = req.body.couriername ? req.body.couriername : courier.couriername;
            courier.courierdes = req.body.courierdes ? req.body.courierdes : courier.courierdes;
            courier.district = req.body.district ? req.body.district : courier.district;
            courier.region = req.body.region ? req.body.region : courier.region;
            courier.courieruser = req.body.courieruser ? req.body.courieruser : courier.courieruser;


            courier.save(function (err, courier) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating courier.',
                        error: err
                    });
                }

                return res.json(courier);
            });
        });
    },

    /**
     * courierController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        courierModel.findByIdAndRemove(id, function (err, courier) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the courier.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
