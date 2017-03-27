var express = require('express');
var router = express.Router();

var wechatutil = require('../common/wechatutil');
var config = require('../frameConfig/frameConfig');
var fansModel = require('../sysmanage/fans/fansModel');

router.get('/',function(req,res,next){
    var url = wechatutil.getwechatauthurl('aft.robustudio.com','/mobile/fans/fansindex');
    console.log("url~~~~~~~~~~"+url)
    res.redirect(url);
});


router.get('/fansindex',wechatutil.getopenid,function(req,res,next){
    var openid = req.session.openid;
    fansModel.findOne({fanopenid:openid})
             .exec(function(err,fans){
                 if(err){
                     console.log(err);
                 }
                 res.redirect(config.mobileTempFans+"?fansid="+fans._id);
             })

    
});



module.exports = router;