var districtModel = require('./districtModel.js');

/**
 * districtController.js
 *
 * @description :: Server-side logic for managing districts.
 */
module.exports = {

    /**
     * districtController.list()
     */
    list: function (req, res) {
        districtModel.find(function (err, districts) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting district.',
                    error: err
                });
            }
            return res.json(districts);
        });
    },

    /**
     * districtController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        districtModel.findOne({_id: id}, function (err, district) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting district.',
                    error: err
                });
            }
            if (!district) {
                return res.status(404).json({
                    message: 'No such district'
                });
            }
            return res.json(district);
        });
    },

    /**
     * districtController.create()
     */
    create: function (req, res) {
        var district = new districtModel({			province : req.body.province,			city : req.body.city,			disctrict : req.body.disctrict
        });

        district.save(function (err, district) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating district',
                    error: err
                });
            }
            return res.status(201).json(district);
        });
    },

    /**
     * districtController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        districtModel.findOne({_id: id}, function (err, district) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting district',
                    error: err
                });
            }
            if (!district) {
                return res.status(404).json({
                    message: 'No such district'
                });
            }

            district.province = req.body.province ? req.body.province : district.province;			district.city = req.body.city ? req.body.city : district.city;			district.disctrict = req.body.disctrict ? req.body.disctrict : district.disctrict;			
            district.save(function (err, district) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating district.',
                        error: err
                    });
                }

                return res.json(district);
            });
        });
    },

    /**
     * districtController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        districtModel.findByIdAndRemove(id, function (err, district) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the district.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
