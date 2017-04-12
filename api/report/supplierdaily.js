var supplierModel = require('../sysmanage/supplier/supplierModel');
var shoporderModel = require('../sysmanage/shoporder/shoporderModel');

var async = require('async')

var getSupplier = function (req, res) {
    shoporderModel.aggregate([
        { $group: { _id: "$supplier", orderamount: { $sum: "$orderamount" } } },
        {
            $lookup:
            {
                from: 'supplierModel',
                localField: 'supplier',
                foreignField: '_id',
                as: 'supplier'
            }
        },
        {"$unwind":"$supplier"},
        {"$project": {"supplier":"$supplier.suppliername", "total":"$orderamount", _id:0}}
        
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
