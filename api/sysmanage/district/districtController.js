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
        districtModel.findOne({ _id: id }, function (err, district) {
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
        var district = new districtModel({
            province: req.body.province,
            city: req.body.city,
            district: req.body.district
        });
        console.log(JSON.stringify(district));

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
        districtModel.findOne({ _id: id }, function (err, district) {
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

            district.province = req.body.province ? req.body.province : district.province;
            district.city = req.body.city ? req.body.city : district.city;
            district.district = req.body.district ? req.body.district : district.district;

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
    },

    //mobilesite的地区选择器的数据构造
    msdData: function (req, res) {
        console.log('sss')
        districtModel
            .find()
            .exec(function (err, districtArray) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting district.',
                        error: err
                    });
                }
                /*遍历ditrict
                 1.取出province数据，构造第一层数据，构造时要排重
                 2.取出city的数据，构造第二层数据，构造时要排重，还需要匹配parent；
                 3.取出district的数据，构造第三层数据，构造时要排重，还需要匹配city
                 使用的是vux2.0中的popup－picke
                */

                var resultArray = [];
                for (var i = 0; i < districtArray.length; i++) {
                    //如果在provincelist中没有该数组元素，就添加进去
                    if (!resultArray.find(d => d.name == districtArray[i].province)) {
                        resultArray.push({
                            name: districtArray[i].province,
                            value: districtArray[i].province,
                            parent: 0
                        })
                    }
                }

                for (var i = 0; i < districtArray.length; i++) {
                    if (!resultArray.find(d => d.name == districtArray[i].city)) {
                        resultArray.push({
                            name: districtArray[i].city,
                            value: districtArray[i].city,
                            parent: districtArray[i].province
                        })
                    }
                }
                for (var i = 0; i < districtArray.length; i++) {
                    if (!resultArray.find(d => d.name == districtArray[i].district)) {
                        resultArray.push({
                            name: districtArray[i].district,
                            value: districtArray[i].district,
                            parent: districtArray[i].city
                        })
                    }
                }
                return res.json(resultArray);

            })
    }
};
