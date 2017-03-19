var express = require('express');
var router = express.Router();
var userController = require('./userController');

/*
    GET mobilesite的地区选择器数据
 */
router.get('/',userController.muser);



module.exports = router;
