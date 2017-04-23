var express = require('express');
var router = express.Router();

var wechatutil = require('../common/wechatutil');
var config = require('../frameConfig/frameConfig');

router.get('/',function(req,res,next){
    var url = wechatutil.getwechatauthurl('aft.robustudio.com','/mobile/agent/agentindex');
    console.log("url~~~~~~~~~~"+url)
    res.redirect(url);
});


router.get('/agentindex',wechatutil.getopenid,function(req,res,next){
    var openid = req.session.openid;

    res.redirect(config.mobileAgent+"?openid="+openid);
});

//移动端一键分发订单
router.post('/mdeliver',function(req,res,next){
    var regionid = req.body.regionid;
    console.log("regionid:"+regionid);


})



module.exports = router;