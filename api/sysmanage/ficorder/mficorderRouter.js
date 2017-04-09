var express = require('express');
var router = express.Router();
var ficorderController = require('./ficorderController');

/*
    GET 粉丝根据regionid获取订单列表的接口
 */
router.get('/ficorderbyregion',ficorderController.ficorderByRegion);

//根据ficorder的id来更新ficstate
router.post('/ficorderstate',ficorderController.updateficstate);


module.exports = router;
