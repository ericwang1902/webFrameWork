var express = require('express');
var router = express.Router();
var wechatutil = require('../common/wechatutil');
var config = require('../frameConfig/frameConfig');

router.get('/index',function(req,res,next){
    var url = wechatutil.getwechatauthurl('aft.robustudio.com','/mobile/shopper/shopperindex');
    res.redirect(url);
});


router.get('/shopperindex',wechatutil.getopenid,function(req,res,next){
    var openid = req.session.openid;

    res.redirect(config.mobileShopper+"?openid="+openid);
});



module.exports = router;