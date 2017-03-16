var express = require('express');
var router = express.Router();

var userController = require('../sysmanage/user/userController');

/*
    GET mobilesite的地区选择器数据
 */
router.post('/',userController.update);



module.exports = router;
