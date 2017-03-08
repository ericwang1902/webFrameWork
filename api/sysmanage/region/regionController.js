var regionModel = require('./regionModel.js');

/**
 * regionController.js
 *
 * @description :: Server-side logic for managing regions.
 */
module.exports = {

    /**
     * regionController.list()
     */
    list: function (req, res) {
        regionModel.find()
            .populate({
                path: "district",
                model: "district"
            })
            .exec(function (err, regions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting region.',
                        error: err
                    });
                }
                return res.json(regions);
            })
    },

    /**
     * regionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        regionModel.findOne({ _id: id }, function (err, region) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting region.',
                    error: err
                });
            }
            if (!region) {
                return res.status(404).json({
                    message: 'No such region'
                });
            }
            return res.json(region);
        });
    },

    /**
     * regionController.create()
     */
    create: function (req, res) {
        var region = new regionModel({
            regionname: req.body.regionname,
            district: req.body.district
        });

        region.save(function (err, region) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating region',
                    error: err
                });
            }
            return res.status(201).json(region);
        });
    },

    /**
     * regionController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        regionModel.findOne({ _id: id }, function (err, region) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting region',
                    error: err
                });
            }
            if (!region) {
                return res.status(404).json({
                    message: 'No such region'
                });
            }

            region.regionname = req.body.regionname ? req.body.regionname : region.rregionname;
            region.district = req.body.district ? req.body.district : region.district;

            region.save(function (err, region) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating region.',
                        error: err
                    });
                }

                return res.json(region);
            });
        });
    },

    /**
     * regionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        regionModel.findByIdAndRemove(id, function (err, region) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the region.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    /*
    mregions
    */
    mregion: function (req, res) {
        var districtid = req.query.districtid;

        regionModel.find({district:districtid})
            .exec(function (err, regions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the region.',
                        error: err
                    });
                }
                if(regions){
                    var regionsback = [];
                    for(var i =0;i<regions.length;i++){
                        var temp={
                            key:regions[i]._id,
                            value:regions[i].regionname
                        }
                        regionsback.push(temp);
                    }
                    return res.json(regions);
                }
                
            })

    }
};
