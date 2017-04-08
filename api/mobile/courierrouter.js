var express = require('express');
var router = express.Router();

var wechatutil = require('../common/wechatutil');
var config = require('../frameConfig/frameConfig');
var  userModel = require('../sysmanage/user/userModel');
var courierModel = require('../sysmanage/courier/courierModel');

router.get('/',function(req,res,next){
    var url = wechatutil.getwechatauthurl('aft.robustudio.com','/mobile/courier/courierindex');
    console.log("url~~~~~~~~~~"+url)
    res.redirect(url);
});


router.get('/courierindex',wechatutil.getopenid,function(req,res,next){
    var openid = req.session.openid;
    //根据openid找userid，根据userid找courier，将regionid返回在queryid里。
    userModel.findOne({openid:openid})
             .exec(function(err,userRes){
                if(err)
                {
                    console.log(err);
                }
                var userid = userRes._id;

                courierModel.findOne({courieruser:userid})
                            .exec(function(err,courierRes){
                                if(err){
                                    console.log(err);
                                }
                                var regionid = courierRes.region;
                                res.redirect(config.mobileCourier+"?openid="+openid+"&regionid="+regionid);
                                
                            })
             })



    
});



module.exports = router;