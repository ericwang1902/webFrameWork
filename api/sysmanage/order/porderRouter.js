var express = require('express');
var router = express.Router();
var orderController = require('./orderController');

/*
    GET 分发订单时，批量更新客户订单的ficorder
 */
router.post('/',orderController.pupdate);



module.exports = router;
