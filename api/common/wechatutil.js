//非全局微信对接的方法

var fansModel = require('../sysmanage/fans/fansModel');

var addressModel = require('../sysmanage/address/addressModel');

var OAuth = require('wechat-oauth');
var config = require('../frameConfig/frameConfig');
var client = new OAuth(config.wechatConfig.appid, config.wechatConfig.appsecret);

var getwechatauthurl= function(domain,path){
   return  client.getAuthorizeURL('http://' + domain + path, 'aft', 'snsapi_userinfo');
}
//第三方库获取openid和user_access_token
var getopenid = function (req, res, next) {
    //如果session中的user_access_token已经过期
    console.log("session中的user_access_token:" + req.session.user_access_token);
    if (!req.session.user_access_token) {

        client.getAccessToken(req.query.code, function (err, result) {
            try {
                var openid = result.data.openid;
                var accessToken = result.data.access_token;

                req.session.openid = openid;
                req.session.user_access_token = accessToken;
                console.log("获取openid：" + req.session.openid)
                console.log("获取access token：" + req.session.user_access_token)


            } catch (error) {
                
                console.log("getopenid:")
                console.log("code:"+req.query.code)
                console.log(err)
                return res.json({
                    info: '获取openid错误'
                })
            }
            return next();

        });
    } else {
        console.log("已经创建了该用户!")
        return next();
    }
}


//创建粉丝档案
var createFans = function (req, res, next) {
    fansModel.findOne({ fanopenid: req.session.openid }, function (err, fanresult) {
        if (err) {
            console.log("createFans err")
            console.log(err);
        }
        //没有创建该fans就进行创建
        if (!fanresult) {
            var fans = new fansModel({
                fannickname: '',
                fanopenid: req.session.openid,
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
        } else {
            //如果该粉丝数据已经创建，就将fanSaveResult写进req
            req.fanSaveResult = fanresult;
            console.log("fanSaveResult:" + JSON.stringify(req.fanSaveResult))

            return next();
        }


    })
}
var getAddressCount=function(req,res,next){
    addressModel.count({fans:req.fanSaveResult._id})
                 .exec(function(err,addresscount){
                     if(err)console.log(err);
                     

                     req.addresscount = addresscount;
                     console.log(req.addresscount )

                     return next();
                 })
}

module.exports = {
    getopenid,
    createFans,
    getwechatauthurl,
    getAddressCount
}