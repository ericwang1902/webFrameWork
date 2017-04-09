var express = require('express');
var router = express.Router();
var shoporderController = require('./shoporderController');

/*
    GET 根据店主的id来获取订单
 */
router.get('/supplier',shoporderController.mshoporderforsupplier);

//根据ficorder来获取店家订单
router.get('/orderbyficorder',shoporderController.getshoporderbyfic);


module.exports = router;
