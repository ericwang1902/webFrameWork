var express = require('express');
var router = express.Router();

//微信网页授权
var OAuth = require('wechat-oauth');
var config = require('../frameConfig/frameConfig');
var client = new OAuth(config.wechatConfig.appid,config.wechatConfig.appsecret);


/* GET home page. */
router.get('/index', function(req, res, next) {
    var url = client.getAuthorizeURL('http://' + 'aft.robustudio.com' + '/mobile/home', 'aft', 'snsapi_userinfo');
    res.redirect(url);
});

router.get('/home',getopenid, function(req, res, next) {
     return res.send("sdf")
});

//第三方库获取openid
function getopenid(req, res, next) {
    client.getAccessToken(req.query.code, function (err, result) {

        try {
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
        } catch (error) {
            console.log(err)
          return  res.redirect('/customer/sendpage');
        }

        req.openid = openid;
        console.log(req.openid);
        return next();
    });
}


module.exports = router;
