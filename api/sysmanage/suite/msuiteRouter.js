var express = require('express');
var router = express.Router();
var suiteController = require('./suiteController');

/*
    GET mobilesite的地区选择器数据
 */
router.get('/',suiteController.msuite);



module.exports = router;
