var suiteModel = require('./suiteModel.js');

/**
 * suiteController.js
 *
 * @description :: Server-side logic for managing suites.
 */
module.exports = {

    /**
     * suiteController.list()
     */
    list: function (req, res) {
        suiteModel
            .find()
            .populate({
                path: "goodslist",
                model: "goods"
            })
            .exec(function (err, suites) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting suite.',
                        error: err
                    });
                }
                return res.json(suites);
            })

    },

    /**
     * suiteController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        suiteModel
            .findOne({ _id: id })
            .populate({
                path: "goodslist",
                model: "goods"
            })
            .exec(function (err, suite) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting suite.',
                        error: err
                    });
                }
                if (!suite) {
                    return res.status(404).json({
                        message: 'No such suite'
                    });
                }
                return res.json(suite);
            })

    },

    /**
     * suiteController.create()
     */
    create: function (req, res) {
        var suite = new suiteModel({
            suitenum: req.body.suitenum,
            suitename: req.body.suitename,
            suitedes: req.body.suitedes,
            suitephoto: req.body.suitephoto,
            suiteprice: req.body.suiteprice,
            suitestate: req.body.suitestate,
            suitetype: req.body.suitetype,
            salesnum: req.body.salesnum,
            goodslist: req.body.goodslist
        });

        suite.save(function (err, suite) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating suite',
                    error: err
                });
            }
            return res.status(201).json(suite);
        });
    },

    /**
     * suiteController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        suiteModel.findOne({ _id: id }, function (err, suite) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting suite',
                    error: err
                });
            }
            if (!suite) {
                return res.status(404).json({
                    message: 'No such suite'
                });
            }

            suite.suitenum = req.body.suitenum ? req.body.suitenum : suite.suitenum;
            suite.suitename = req.body.suitename ? req.body.suitename : suite.suitename;
            suite.suitedes = req.body.suitedes ? req.body.suitedes : suite.suitedes;
            suite.suitephoto = req.body.suitephoto ? req.body.suitephoto : suite.suitephoto;
            suite.suiteprice = req.body.suiteprice ? req.body.suiteprice : suite.suiteprice;
            suite.suitestate = req.body.suitestate ? req.body.suitestate : suite.suitestate;
            suite.suitetype = req.body.suitetype ? req.body.suitetype : suite.suitetype;
            suite.salesnum = req.body.salesnum ? req.body.salesnum : suite.salesnum;
            suite.goodslist = req.body.goodslist ? req.body.goodslist : suite.goodslist;

            suite.save(function (err, suite) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating suite.',
                        error: err
                    });
                }

                return res.json(suite);
            });
        });
    },

    /**
     * suiteController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        suiteModel.findByIdAndRemove(id, function (err, suite) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the suite.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
