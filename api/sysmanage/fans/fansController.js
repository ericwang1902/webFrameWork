var fansModel = require('./fansModel.js');

/**
 * fansController.js
 *
 * @description :: Server-side logic for managing fanss.
 */
module.exports = {

    /**
     * fansController.list()
     */
    list: function (req, res) {
        fansModel.find()
            .populate({
                path: 'district',
                model: 'district'
            })
            .exec(function (err, fanslist) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting fans.',
                        error: err
                    });
                }
                return res.json(fanss);
            })
    },

    /**
     * fansController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        fansModel.findOne({ _id: id })
            .populate({
                path: 'district',
                model: 'district'
            })
            .exec(function (err, fans) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting fans.',
                        error: err
                    });
                }
                if (!fans) {
                    return res.status(404).json({
                        message: 'No such fans'
                    });
                }
                return res.json(fans);
            })

    },

    /**
     * fansController.create()
     */
    create: function (req, res) {
        var fans = new fansModel({
            fannickname: req.body.fannickname,
            fanopenid: req.body.fanopenid,
            orders: req.body.orders,
            points: req.body.points,
            coupons: req.body.coupons,
            district: req.body.district
        });

        fans.save(function (err, fans) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating fans',
                    error: err
                });
            }
            return res.status(201).json(fans);
        });
    },

    /**
     * fansController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        fansModel.findOne({ _id: id }, function (err, fans) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting fans',
                    error: err
                });
            }
            if (!fans) {
                return res.status(404).json({
                    message: 'No such fans'
                });
            }

            fans.fannickname = req.body.fannickname ? req.body.fannickname : fans.fannickname;
            fans.fanopenid = req.body.fanopenid ? req.body.fanopenid : fans.fanopenid;
            fans.orders = req.body.orders ? req.body.orders : fans.orders;
            fans.points = req.body.points ? req.body.points : fans.points;
            fans.coupons = req.body.coupons ? req.body.coupons : fans.coupons;
            fans.district = req.body.district ? req.body.district : fans.district;

            fans.save(function (err, fans) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating fans.',
                        error: err
                    });
                }

                return res.json(fans);
            });
        });
    },

    /**
     * fansController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        fansModel.findByIdAndRemove(id, function (err, fans) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the fans.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
