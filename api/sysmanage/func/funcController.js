var funcModel = require('./funcModel.js');

/**
 * funcController.js
 *
 * @description :: Server-side logic for managing funcs.
 */
module.exports = {

    /**
     * 查询所有功能
     */
    list: function (req, res) {
        funcModel.find(function (err, funcs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting function.',
                    error: err
                });
            }
            return res.json(funcs);
        });
    },

    /**
     * 根据id查询单个功能
     */
    show: function (req, res) {
        var id = req.params.id;
        funcModel.findOne({_id: id}, function (err, func) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting function.',
                    error: err
                });
            }
            if (!func) {
                return res.status(404).json({
                    message: 'No such function'
                });
            }
            return res.json(func);
        });
    },

    /**
     * 创建单个功能
     */
    create: function (req, res) {
        var func = new funcModel({
			funcName : req.body.funcName,
			funcLink : req.body.funcLink
        });

        func.save(function (err, func) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating function',
                    error: err
                });
            }
            return res.status(201).json(func);
        });
    },

    /**
     * 更新功能
     */
    update: function (req, res) {
        var id = req.params.id;
        funcModel.findOne({_id: id}, function (err, func) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting function',
                    error: err
                });
            }
            if (!func) {
                return res.status(404).json({
                    message: 'No such function'
                });
            }

            func.funcName = req.body.funcName ? req.body.funcName : func.funcName;
			func.functionLink = req.body.funcLink ? req.body.funcLink : func.funcLink;
			
            func.save(function (err, func) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating function.',
                        error: err
                    });
                }

                return res.json(func);
            });
        });
    },

    /**
     * 删除功能
     */
    remove: function (req, res) {
        var id = req.params.id;
        funcModel.findByIdAndRemove(id, function (err, func) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the function.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
