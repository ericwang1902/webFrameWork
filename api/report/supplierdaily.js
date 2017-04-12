var supplierModel = require('../sysmanage/supplier/supplierModel');
var shoporderModel = require('../sysmanage/shoporder/shoporderModel');
var moment = require('moment');

var async = require('async')

var getSupplier = function (req, res) {
    var today = moment().set({ 'hour': 0, 'minute': 0, 'second': 30 });
    console.log(today)

    shoporderModel.aggregate([
        { $match: { ordertime: { $gte: today } } },
        { $group: { _id: { supplierid: "$supplier" }, orderamount: { $sum: "$orderamount" } } },
        {
            $lookup:
            {
                from: 'suppliers',//这个要不是model，而是suppliers，是collection的名字！！！
                localField: '_id.supplierid',
                foreignField: '_id',
                as: 'supplierdoc'
            }
        }

    ])
        .exec(function (err, shoporders) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting supplier.',
                    error: err
                });
            }


            return res.json(shoporders);
        })
}

module.exports = {
    getSupplier: getSupplier
}
