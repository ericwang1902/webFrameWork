var supplierModel = require('../sysmanage/supplier/supplierModel');
var shoporderModel = require('../sysmanage/shoporder/shoporderModel');

var async = require('async')

var getSupplier = function (req, res) {
    shoporderModel.aggregate([
        { $group: { supplierid: "$supplier", totalamount: { $sum: "$orderamount" } } },
        {
            $lookup:
            {
                from: 'supplierModel',
                localField: 'supplierid',
                foreignField: '_id',
                as: 'supplier'
            }
        }
        ]
        )
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
