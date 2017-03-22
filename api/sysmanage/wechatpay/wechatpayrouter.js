var express = require('express');
var router = express.Router();

/*
    GET 微信支付回调
 */
router.post('/',function(req,res){
    console.log(req.body);
});
router.get('/',function(req,res){
    console.log(req.body);
});


module.exports = router;
