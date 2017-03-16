var express = require('express');
var router = express.Router();

var fansModel = require('../sysmanage/fans/fansModel');

var wechatutil = require('../common/wechatutil');

var wechatapi = require('../common/wechatapi')

var mobileRouter =require('./mobilerouter');

var config = require('../frameConfig/frameConfig');




// 这里的路由都是/mobile/xxx，不需要加sysmanage
/*  index用来获取openid，并用来跳转到home */
router.get('/index', function (req, res, next) {
    //  var url = client.getAuthorizeURL('http://' + 'aft.robustudio.com' + '/mobile/home', 'aft', 'snsapi_userinfo');
    var url = wechatutil.getwechatauthurl('aft.robustudio.com','/mobile/home');
    res.redirect(url);
});


// 通过跳转到home携带code，获取openid，只能用这种跳转的方式，不能用ajax访问获取openid
router.get('/home', wechatutil.getopenid, wechatutil.createFans, function (req, res, next) {

    //获取了fan的数据之后，判断该fan是否有district数据，如果没有，就跳转到initfans；如果有，就直接跳转到前端home路由
    if(!req.fanSaveResult.district){
        res.redirect(config.mobileUserInitURL+"?userid="+req.fanSaveResult._id);
    }else{
        res.redirect(config.mobileUserHome+"?userid="+req.fanSaveResult._id);
    }

  //  console.log("fanSaveResult：" + JSON.stringify(req.fanSaveResult))
   // console.log("openid：" + req.session.openid)
   // console.log("user_access_token:" + JSON.stringify(req.session.user_access_token))

    // wechatapi.getApiToken(function () {
    //     console.log("发送模板消息回调")
    //     wechatapi.sendNewOrderTemplateMsg(req.session.openid);//测试模板消息发送
    // });//获取全局token,后面要删掉，不能每次用户授权，就获取全局的token

    // res.send("homepage")
   // res.redirect("http://localhost:8090/")
});


//mobile/bind 用来获取用户openid⭐️️️️️️️️️️
//店主、配送员、区域代理的openid的绑定
router.get('/bind', function (req, res, next) {
    var url = client.getAuthorizeURL('http://' + 'aft.robustudio.com' + '/mobile/bindjump', 'aft', 'snsapi_userinfo');
    res.redirect(url);
});

//bind页面跳转到bindjump，获取openid
router.get('/bindjump',wechatutil.getopenid,function(req,res,next){
    var openid = req.session.openid;
    console.log("用户绑定openid:"+openid);
    res.redirect(config.mobileUserBind+"?openid="+openid);//将openid通过querystring传递到userbind表单页面  
})

router.use('/userbind',mobileRouter);//用户绑定




module.exports = router;
