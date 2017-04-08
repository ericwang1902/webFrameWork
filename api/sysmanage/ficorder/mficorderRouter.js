var express = require('express');
var router = express.Router();
var ficorderController = require('./ficorderController');

/*
    GET 粉丝根据regionid获取订单列表的接口
 */
router.get('/ficorderbyregion',ficorderController.ficorderByRegion);



module.exports = router;
