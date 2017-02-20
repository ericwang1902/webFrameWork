var express = require('express');
var router = express.Router();

var request = require('request');

var config = require('../frameConfig/frameConfig')

var fansModel = require('../sysmanage/fans/fansModel');

//微信网页授权
var OAuth = require('wechat-oauth');
var config = require('../frameConfig/frameConfig');
var client = new OAuth(config.wechatConfig.appid, config.wechatConfig.appsecret);

var wechatapi = require('../common/wechatapi')


/*  index用来获取openid，并用来跳转到home */
router.get('/index', function (req, res, next) {
    var url = client.getAuthorizeURL('http://' + 'aft.robustudio.com' + '/mobile/home', 'aft', 'snsapi_userinfo');
    res.redirect(url);
});

// 通过跳转到home携带code，获取openid，只能用这种跳转的方式，不能用ajax访问获取openid
router.get('/home',getopenid, createFans, function (req, res, next) {
    console.log(JSON.stringify(req.fanSaveResult))
    console.log("user_access_token:" + JSON.stringify(req.session.user_access_token))

    wechatapi.getApiToken(function(){
        wechatapi.sendNewOrderTemplateMsg(req.session.openid);//测试模板消息发送
    });//获取全局token,后面要删掉，不能每次用户授权，就获取全局的token
    
    res.send("homepage")
});

//第三方库获取openid和user_access_token
function getopenid(req, res, next) {
    //如果session中的user_access_token已经过期
    console.log("session中的user_access_token:"+req.session.user_access_token);
    if (!req.session.user_access_token) {
        
        client.getAccessToken(req.query.code, function (err, result) {
            try {
                var openid = result.data.openid;
                var accessToken = result.data.access_token;
              
                req.session.openid = openid;
                req.session.user_access_token = accessToken;
                console.log("获取access token："+req.session.user_access_token)

            } catch (error) {
                console.log(err)
                return res.json({
                    info: '获取openid错误'
                })
            }

            return next();
        });
    }else{
        return next();
    }


}

//创建粉丝档案
function createFans(req, res, next) {
    fansModel.findOne({ fanopenid: req.session.openid }, function (err, fanresult) {
        if (err) {
            console.log(err);
        }
        //没有创建该fans就进行创建
        if (!fanresult) {
            var fans = new fansModel({
                fannickname: '',
                fanopenid: req.openid,
                orders: [],
                points: 0,
                coupons: []
            });
            fans.save(function (err, fanSaveResult) {
                if (err) {
                    console.log(err);
                }
                //添加成功
                req.fanSaveResult = fanSaveResult;
                return next();
            })
        }
        //如果该粉丝数据已经创建，就将fanSaveResult写进req
        req.fanSaveResult = fanresult;

        return next();

    })
}


module.exports = router;
