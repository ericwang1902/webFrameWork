var supplierModel = require('../sysmanage/supplier/supplierModel');
var shoporderModel = require('../sysmanage/shoporder/shoporderModel');

var async = require('async')

var getSupplier = function (req, res) {
    supplierModel.find()
        .exec(function (err, suppliers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting supplier.',
                    error: err
                });
            }

            return res.json(suppliers);
        })
}

module.exports = {
    getSupplier: getSupplier
}
