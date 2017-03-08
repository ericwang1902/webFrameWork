var addressModel = require('./addressModel.js');

/**
 * addressController.js
 *
 * @description :: Server-side logic for managing addresss.
 */
module.exports = {

    /**
     * addressController.list()
     */
    list: function (req, res) {
        addressModel.find()
            .populate({
                path: "region",
                model: "region",
                populate: {
                    path: "district",
                    model: "district"
                }
            })
            .exec(function (err, addresss) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting address.',
                        error: err
                    });
                }
                return res.json(addresss);
            })


    },

    /**
     * addressController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        addressModel.findOne({ _id: id }).populate({
            path: "region",
            model: "region",
            populate: {
                path: "district",
                model: "district"
            }
        }).exec(function (err, address) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting address.',
                    error: err
                });
            }
            if (!address) {
                return res.status(404).json({
                    message: 'No such address'
                });
            }
            return res.json(address);
        })
    },

    /**
     * addressController.create()
     */
    create: function (req, res) {
        var address = new addressModel({
            detail: req.body.detail,
            phone: req.body.phone,
            region: req.body.region,
            name: req.body.name,
            fans: req.body.fans
        });

        address.save(function (err, address) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating address',
                    error: err
                });
            }
            return res.status(201).json(address);
        });
    },

    /**
     * addressController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        addressModel.findOne({ _id: id }, function (err, address) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting address',
                    error: err
                });
            }
            if (!address) {
                return res.status(404).json({
                    message: 'No such address'
                });
            }

            address.detail = req.body.detail ? req.body.detail : address.detail;
            address.phone = req.body.phone ? req.body.phone : address.phone;
            address.region = req.body.region ? req.body.region : address.region;
            address.name = req.body.name ? req.body.name : address.name;
            address.fans = req.body.fans ? req.body.fans : address.fans;

            address.save(function (err, address) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating address.',
                        error: err
                    });
                }

                return res.json(address);
            });
        });
    },

    /**
     * addressController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        addressModel.findByIdAndRemove(id, function (err, address) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the address.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
    //maddress
    maddress: function (req, res) {
        var fansid = req.query.fansid;
        var conditions = {};
        conditions = {
            fans: fansid
        }
        addressModel.find(conditions )
            .exec(function (err, addresss) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the address.',
                        error: err
                    });
                }
                return res.json(addresss);
            })

    }
};
