var express = require('express');
var router = express.Router();
var config = require('../frameConfig/frameConfig');
var wechatpay = require('../common/wechatpay');


router.get('/',function(req,res){
    var jsapiticket = config.jsapiticket;
    var noncestr = Math.random().toString(36).substr(2, 15);
    var timestamp = parseInt(new Date().getTime() / 1000) + '';
    var url = config.wxjsurl;
    var appid = config.wechatConfig.appid;

    var signature = wechatpay.wxjssign(jsapiticket,noncestr,timestamp,url);

    res.json({
        appid:appid,
        timestamp:timestamp,
        noncestr:noncestr,
        signature:signature
    });
})

module.exports = router;