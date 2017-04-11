var supplierModel = require('../sysmanage/supplier/supplierModel');
var shoporderModel = require('../sysmanage/shoporder/shoporderModel');

var async = require('async')

var getSupplier = function (req, res) {
    shoporderModel.aggregate(
        { $group: { supplierid: "$supplier", totalamount: { $sum: "$orderamount" } } }
    )
        .exec(function (err, ordersums) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting supplier.',
                    error: err
                });
            }
            supplierModel.populate(ordersums, { path: 'supplierid' }, function (err, popordersums) {
                 return res.json(popordersums);
            });
        })
}



module.exports = {
    getSupplier: getSupplier
}
