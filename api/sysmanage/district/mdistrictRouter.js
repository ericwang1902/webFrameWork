var express = require('express');
var router = express.Router();
var districtController = require('./districtController.js');

/*
    GET mobilesite的地区选择器数据
 */
router.get('/',districtController.msdData);



module.exports = router;
