var express = require('express');
var router = express.Router();
var wechatutil = require('../common/wechatutil');//微信粉丝部分的方法封装
var wechatapi = require('../common/wechatapi')//微信公共接口的方法封装

var fansModel = require('../sysmanage/fans/fansModel');

var mobileRouter =require('./mobilerouter');
var config = require('../frameConfig/frameConfig');

var fansRouter = require('./fanrouter');
var adminRouter = require('./adminrouter');
var agentRouter = require('./agentrouter')
var courierRouter = require('./courierrouter');
var shopperrRouter = require('./shopperrouter');
var wxjsapiticket = require('./wxjsapiticket');

// 这里的路由都是/mobile/xxx，不需要加sysmanage
/*  index用来获取openid，并用来跳转到home */
router.get('/index', function (req, res, next) {
    var url = wechatutil.getwechatauthurl('aft.robustudio.com','/mobile/home');
    res.redirect(url);
});

// 通过跳转到home携带code，获取openid，只能用这种跳转的方式，不能用ajax访问获取openid
router.get('/home', wechatutil.getopenid, wechatutil.createFans,wechatutil.getAddressCount, function (req, res, next) {
    
  //  res.redirect(config.mobileUserHome+"?userid="+req.fanSaveResult._id);
    
    //取消前置
    if(req.fanSaveResult.district){
        res.redirect(config.mobileUserHome+"?userid="+req.fanSaveResult._id);
    }else{
        if(req.addresscount==0){
            res.redirect(config.mobileUserInitURL+"?userid="+req.fanSaveResult._id);
        }else{
            res.redirect(config.mobildUserAddlist+"?userid="+req.fanSaveResult._id);
        }
    }

});





//mobile/bind 用来获取用户openid⭐️️️️️️️️️️
//店主、配送员、区域代理的openid的绑定
router.get('/bind', function (req, res, next) {
    var url = wechatutil.getwechatauthurl('aft.robustudio.com','/mobile/bindjump');
    res.redirect(url);
});

//bind页面跳转到bindjump，获取openid
router.get('/bindjump',wechatutil.getopenid,function(req,res,next){
    var openid = req.session.openid;
    console.log("用户绑定openid:"+openid);
    res.redirect(config.mobileUserBind+"?openid="+openid);//将openid通过querystring传递到userbind表单页面  
})

//用户绑定页面网址
router.use('/userbind',mobileRouter);

//以下四个主要用来配微信的菜单url，需要做微信获取openid的跳转

//用户模板消息的url
router.use('/fans',fansRouter);

//管理员微信端路由,mobile/admin
router.use('/admin',adminRouter);

//区域代理微信端路由,mobile/agent
//绑定微信端页面url是：/mobile/agent，完成
router.use('/agent',agentRouter);

//配送员微信端路由,mobile/courier
router.use('/courier',courierRouter);

//店主微信端路由,mobile/shopper
//绑定微信端页面url是：/mobile/shopper/
router.use('/shopper',shopperrRouter);

//微信端用来获取jsapiticket的接口
router.use('/jsapiticket',wxjsapiticket);



module.exports = router;
