var supplierModel = require('../sysmanage/supplier/supplierModel');
var shoporderModel = require('../sysmanage/shoporder/shoporderModel');

var async = require('async')

var getSupplier = function (req, res) {
        shoporderModel.aggregate([
              { $group: { _id: { supplierid: "$supplier" }, orderamount: { $sum: "$orderamount" } } },
            {
                $lookup:
                {
                    from: 'supplier',
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
