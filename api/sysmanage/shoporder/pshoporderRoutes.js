var express = require('express');
var router = express.Router();
var shoporderController = require('./shoporderController');

/*
    GET 创建商店订单
 */
router.post('/',shoporderController.pcreate);



module.exports = router;
