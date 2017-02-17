var express = require('express');
var router = express.Router();

var request = require('request');

var config = require('../frameConfig/frameConfig')

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
router.get('/home', getopenid, createFans, createMenu, function (req, res, next) {
    console.log(JSON.stringify(req.fanSaveResult))
    console.log("access_token:" + JSON.stringify(req.session.access_token))
    console.log('test:'+req.session.test);
    res.send("homepage")
});

//第三方库获取openid和access_token
function getopenid(req, res, next) {
    //如果session中的access_token已经过期
    req.session.test="test";
    console.log("session中是否有access_token:"+req.session.access_token);
    if (!req.session.access_token) {
        client.getAccessToken(req.query.code, function (err, result) {
            try {
                var openid = result.data.openid;
                var accessToken = result.data.access_token;
                var refreshToken = result.data.refresh_token;

                req.session.openid = openid;
                req.session.access_token = accessToken;

            } catch (error) {
                console.log(err)
                return res.json({
                    info: '获取openid错误'
                })
            }

            return next();
        });
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

//创建菜单
function createMenu(req, res, next) {
    var menuOptions = {
        url: config.wechatMenuURL + req.session.access_token,
        method: 'POST',
        json: true,
        body: {

        }
    }
    request(menuOptions, function (err, response, body) {
        console.log('createmenu URL:' + menuOptions.url)
        console.log('createMenu:' + JSON.stringify(body));
        if (body.errcode == '40001') {

        }
        return next();
    })

}

//refresh_token
function refreshToken(req, res, next) {
    client.refreshAccessToken(req.session.refresh_token, function (err, result) {
        console.log('refreshtoken:' + JSON.stringify(result));
    });
}

module.exports = router;
