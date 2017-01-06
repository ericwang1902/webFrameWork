var functionModel = require('./functionModel.js');

/**
 * functionController.js
 *
 * @description :: Server-side logic for managing functions.
 */
module.exports = {

    /**
     * functionController.list()
     */
    list: function (req, res) {
        functionModel.find(function (err, functions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting function.',
                    error: err
                });
            }
            return res.json(functions);
        });
    },

    /**
     * functionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        functionModel.findOne({_id: id}, function (err, function) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting function.',
                    error: err
                });
            }
            if (!function) {
                return res.status(404).json({
                    message: 'No such function'
                });
            }
            return res.json(function);
        });
    },

    /**
     * functionController.create()
     */
    create: function (req, res) {
        var function = new functionModel({			functionName : req.body.functionName,			functionLink : req.body.functionLink
        });

        function.save(function (err, function) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating function',
                    error: err
                });
            }
            return res.status(201).json(function);
        });
    },

    /**
     * functionController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        functionModel.findOne({_id: id}, function (err, function) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting function',
                    error: err
                });
            }
            if (!function) {
                return res.status(404).json({
                    message: 'No such function'
                });
            }

            function.functionName = req.body.functionName ? req.body.functionName : function.functionName;			function.functionLink = req.body.functionLink ? req.body.functionLink : function.functionLink;			
            function.save(function (err, function) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating function.',
                        error: err
                    });
                }

                return res.json(function);
            });
        });
    },

    /**
     * functionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        functionModel.findByIdAndRemove(id, function (err, function) {
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
