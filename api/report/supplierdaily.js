var supplierModel = require('../sysmanage/supplier/supplierModel');

var getSupplier = function (req,res) {
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

module.exports ={
    getSupplier
}
