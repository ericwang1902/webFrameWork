var express = require('express');
var router = express.Router();
var shoporderController = require('./shoporderController');

/*
    GET mobilesite的地区选择器数据
 */
router.post('/',shoporderController.pcreate);



module.exports = router;
