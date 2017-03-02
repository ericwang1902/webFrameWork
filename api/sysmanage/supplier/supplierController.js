var supplierModel = require('./supplierModel.js');

/**
 * supplierController.js
 *
 * @description :: Server-side logic for managing suppliers.
 */
module.exports = {

    /**
     * supplierController.list()
     */
    list: function (req, res) {
         //构造查询条件，admin例外
        var role = req.user.role[0].roleName;
        var districtId= req.user.district._id;
        var conditions = {};
        console.log(role);
        if (role == 'ADMIN') {
            conditions={}
        }else{
            conditions={district: districtId}
        }

        supplierModel.find(conditions)
            .populate('supplieruser')
            .populate({
                path:'workers',
                select:'_id username nickname',
                model:'user'
            })
            .exec(function (err, suppliers) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting supplier.',
                        error: err
                    });
                }
                return res.json(suppliers);

            })
    },

    /**
     * supplierController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        supplierModel.findOne({ _id: id })
            .populate('supplieruser')
            .exec(function (err, supplieruser) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting supplier.',
                        error: err
                    });
                }
                if (!supplieruser) {
                    return res.status(404).json({
                        message: 'No such supplier'
                    });
                }
                return res.json(supplieruser);
            })
    },

    /**
     * supplierController.create()
     */
    create: function (req, res) {
        console.log(req.body);

        var supplier = new supplierModel({
            suppliernum: req.body.suppliernum,
            suppliername: req.body.suppliername,
            district:req.user.district._id,
            supplierdes: req.body.supplierdes,
            supplieruser: req.body.supplieruser,
            workers: req.body.workers
        });

        supplier.save(function (err, supplier) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating supplier',
                    error: err
                });
            }
            return res.status(201).json(supplier);
        });
    },

    /**
     * supplierController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        supplierModel.findOne({ _id: id }, function (err, supplier) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting supplier',
                    error: err
                });
            }
            if (!supplier) {
                return res.status(404).json({
                    message: 'No such supplier'
                });
            }

            supplier.suppliernum = req.body.suppliernum ? req.body.suppliernum : supplier.suppliernum;
            supplier.suppliername = req.body.suppliername ? req.body.suppliername : supplier.suppliername;
            supplier.supplierdes = req.body.supplierdes ? req.body.supplierdes : supplier.supplierdes;
            supplier.supplieruser = req.body.supplieruser ? req.body.supplieruser : supplier.supplieruser;
            supplier.workers = req.body.workers ? req.body.workers : supplier.workers;
            supplier.district = req.user.district._id ? req.user.district._id:supplier.district;

            supplier.save(function (err, supplier) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating supplier.',
                        error: err
                    });
                }

                return res.json(supplier);
            });
        });
    },

    /**
     * supplierController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        supplierModel.findByIdAndRemove(id, function (err, supplier) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the supplier.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
