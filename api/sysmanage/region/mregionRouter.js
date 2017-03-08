var express = require('express');
var router = express.Router();
var regionController = require('./regionController');

/*
    GET mobilesite的地区选择器数据
 */
router.get('/',regionController.mregion);



module.exports = router;
