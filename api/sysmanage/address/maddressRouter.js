var express = require('express');
var router = express.Router();
var addressController = require('./addressController');

/*
    GET mobilesite的地区选择器数据
 */
router.get('/',addressController.maddress);



module.exports = router;
