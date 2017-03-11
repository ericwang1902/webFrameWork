var express = require('express');
var router = express.Router();
var orderController = require('./orderController');

/*
    GET mobilesite的地区选择器数据
 */
router.get('/',orderController.morderlist);



module.exports = router;
