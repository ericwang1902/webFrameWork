var express = require('express');
var router = express.Router();
var orderController = require('./orderController');

/*
    GET 粉丝根据fanid获取订单列表的接口
 */
router.get('/fan',orderController.morderlistfan);

/*
    区域代理
*/
router.get('/agent',orderController.morderlistagent);

/*
    
*/


module.exports = router;
