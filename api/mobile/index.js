var express = require('express');
var router = express.Router();

var fansModel = require('../sysmanage/fans/fansModel');

//微信网页授权
var OAuth = require('wechat-oauth');
var config = require('../frameConfig/frameConfig');
var client = new OAuth(config.wechatConfig.appid, config.wechatConfig.appsecret);


/*  index用来获取openid，并用来跳转到home */
router.get('/index', function (req, res, next) {
    var url = client.getAuthorizeURL('http://' + 'aft.robustudio.com' + '/mobile/home', 'aft', 'snsapi_userinfo');
    res.redirect(url);
});

// 获取openid，只能用这种跳转的方式，不能用ajax访问获取openid
router.get('/home', getopenid,createFans, function (req, res, next) {
    console.log(JSON.stringify(req.fanSaveResult))
});

//第三方库获取openid
function getopenid(req, res, next) {
    client.getAccessToken(req.query.code, function (err, result) {

        try {
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
        } catch (error) {
            console.log(err)
            return res.json({
                info: '获取openid错误'
            })
        }

        req.openid = openid;
        //console.log(req.openid);
        return next();
    });
}

//创建粉丝
function createFans(req, res, next) {
    fansModel.findOne({ fanopenid: req.openid }, function (err, fanresult) {
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
            fans.save(function(err,fanSaveResult){
                if(err){
                    console.log(err);
                }
                //添加成功
                req.fanSaveResult = fanSaveResult;
                return next();
            })
        }
        //如果该粉丝数据已经创建
        return next();

    })
}

module.exports = router;
