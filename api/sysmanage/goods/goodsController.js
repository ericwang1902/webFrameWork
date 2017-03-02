var goodsModel = require('./goodsModel.js');

/**
 * goodsController.js
 *
 * @description :: Server-side logic for managing goodss.
 */
module.exports = {

    /**
     * goodsController.list()
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
        goodsModel
            .find(conditions)
            .populate('supplier')
            .exec(function (err, goodslist) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting goodslist.',
                        error: err
                    });
                }
                return res.json(goodslist);
            })

    },

    /**
     * goodsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        goodsModel.findOne({ _id: id }, function (err, goods) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting goods.',
                    error: err
                });
            }
            if (!goods) {
                return res.status(404).json({
                    message: 'No such goods'
                });
            }
            return res.json(goods);
        });
    },

    /**
     * goodsController.create()
     */
    create: function (req, res) {
        var goods = new goodsModel({
            goodsnum: req.body.goodsnum,
            goodsname: req.body.goodsname,
            goodsdes: req.body.goodsdes,
            goodsphoto: req.body.goodsphoto,
            goodsprice: req.body.goodsprice,
            goodsbuyprice: req.body.goodsbuyprice,
            goodsstate: req.body.goodsstate,
            goodstype: req.body.goodstype,
            weight: req.body.weight,
            supplier: req.body.supplier,
            salesnum: req.body.salesnum,
            goodsjudge: req.body.goodsjudge,
            district:req.body.district
        });

        goods.save(function (err, goods) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating goods',
                    error: err
                });
            }
            return res.status(201).json(goods);
        });
    },

    /**
     * goodsController.update()
     */
    update: function (req, res) {

        var id = req.params.id;
        console.log(req.body);
        goodsModel.findOne({ _id: id }, function (err, goods) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting goods',
                    error: err
                });
            }
            if (!goods) {
                return res.status(404).json({
                    message: 'No such goods'
                });
            }

            goods.goodsnum = req.body.goodsnum ? req.body.goodsnum : goods.goodsnum;
            goods.goodsname = req.body.goodsname ? req.body.goodsname : goods.goodsname;
            goods.goodsdes = req.body.goodsdes ? req.body.goodsdes : goods.goodsdes;
            goods.goodsphoto = req.body.goodsphoto ? req.body.goodsphoto : goods.goodsphoto;
            goods.goodsprice = req.body.goodsprice ? req.body.goodsprice : goods.goodsprice;
            goods.goodsbuyprice = req.body.goodsbuyprice ? req.body.goodsbuyprice : goods.goodsbuyprice;
            goods.goodsstate = req.body.goodsstate ? req.body.goodsstate : goods.goodsstate;
            goods.goodstype = req.body.goodstype ? req.body.goodstype : goods.goodstype;
            goods.weight = req.body.weight ? req.body.weight : goods.weight;
            goods.supplier = req.body.supplier ? req.body.supplier : goods.supplier;
            goods.salesnum = req.body.salesnum ? req.body.salesnum : goods.salesnum;
            goods.goodsjudge = req.body.goodsjudge ? req.body.goodsjudge : goods.goodsjudge;
            goods.district = req.bod.district ? req.bod.district :goods.district;
            
            goods.save(function (err, goods) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating goods.',
                        error: err
                    });
                }

                return res.json(goods);
            });
        });
    },

    /**
     * goodsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        goodsModel.findByIdAndRemove(id, function (err, goods) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the goods.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
