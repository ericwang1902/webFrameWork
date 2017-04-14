var express = require('express');
var router = express.Router();

var passport  = require('passport');

var funcRouter = require('./func/funcRoutes');
var menuRouter = require('./menu/menuRoutes');
var roleRouter = require('./role/roleRoutes');
var userRouter = require('./user/userRoutes');
var supplierRouter = require('./supplier/supplierRoutes')
var goodsRouter = require('./goods/goodsRoutes');
var suiteRouter = require('./suite/suiteRoutes');
var districtRouter = require('./district/districtRoutes');
var regionRouter = require('./region/regionRoutes');
var addressRouter = require('./address/addressRoutes');
var fanRouter = require('./fans/fansRoutes')
var orderRouter = require('./order/orderRoutes');
var porderRouter = require('./order/porderRouter');
var ficorderRouter = require('./ficorder/ficorderRoutes');
var shoporderRouter = require('./shoporder/shoporderRoutes');
var pshoporderRouter = require('./shoporder/pshoporderRoutes');
var courierRouter = require('./courier/courierRoutes');

var mdistrictRouter = require('./district/mdistrictRouter');
var mregionRouter  = require('./region/mregionRouter')
var maddressRouter = require('./address/maddressRouter');
var msuiteRouter = require('./suite/msuiteRouter');
var morderRouter = require('./order/morderRouter');
var muserRouter = require('./user/muserRouter')

var mshopeorderRouter = require('./shoporder/mshoporderRouter');

var wechatpayRouter = require('./wechatpay/wechatpayrouter');
var mficorderRouter = require('./ficorder/mficorderRouter');

//无分页的数据列表API
var formlistdata = require('./formlistdataRoute');


var qiniuToken = require('../common/qiniu')


//only function router
//sysmanage/function
router.use('/func', funcRouter);

//menu router
//sysmanage/menu
router.use('/menu', menuRouter);

//role router
//sysmanage/role
router.use('/role', roleRouter);

//user router
//sysmanage/user
router.use('/user', userRouter);

//muserRouter
router.use('/muser',muserRouter);


//supplier router
//sysmanage/supplier
router.use('/supplier',supplierRouter);

//goods router
//sysmanage/goods

router.use('/goods',goodsRouter);

//suite router
//sysmanage/suite
router.use('/suite',suiteRouter);
//msuiteRouter
//sysmanage/msuite
router.use('/msuite',msuiteRouter);

//district router 
//sysmanage/district
router.use('/district',districtRouter);

//mobile district router
//sysmanage/mdistrict
router.use('/mdistrict',mdistrictRouter);

//region router
//sysmanage/region
router.use('/region',regionRouter);

//mregion router 
//sysmanage/mregion
router.use('/mregion',mregionRouter);

//address router
//sysmanage/address
router.use('/address',addressRouter);
//maddressRouter
router.use('/maddress',maddressRouter);

//fansRoute
router.use('/fans',fanRouter);

//orderRoute
router.use('/order',orderRouter);
//porderRouter
router.use('/porder',porderRouter);
//morderrouter
router.use('/morder',morderRouter);
//ficorderRouter
router.use('/ficorder',ficorderRouter);
//mficorderRouter
router.use('/mficorder',mficorderRouter);

//pshoporderRouter
router.use('/pshoporder',pshoporderRouter);

//shoporderRouter
router.use('/shoporder',shoporderRouter);

//根据供应商id获取shoporder
router.use('/mshoporder',mshopeorderRouter);

//配送员
router.use('/courier',courierRouter);

//
router.use('/formlistdata',formlistdata);

//微信支付回调地址
router.use('/wechatpayback',wechatpayRouter);

// router.use('/wechatpaytest',wechatpaytest);//微信支付测试授权目录
// router.use('/wechatpay',wechatpay);//微信支付正式授权目录


//图片上传uploadtoken
router.get('/qiniu',qiniuToken.getToken);

router.post('/test',function(req,res){
    console.log(req.body)
    console.log(req.params)
    console.log(req.query)
    return res.json({
        req:"req"
    })
})





//*********************************登录区***************************
//自定义回调函数
router.post('/login',passportAuth, function (req, res, next) {
    req.session.seesionUserId = req.user._id;
    req.session.user = req.user;
    console.log("session:"+JSON.stringify(req.session.user))//登录验证后，用户的信息会在req.user里
    console.log('success!')
    return res.json({
        state: 200,
        authresult: true,
        user:req.user,
        info: "info"
    })
});

//自定义回调函数
//get地址是：http://localhost:3000/sysmanage/func?username=123&password=1234
router.get('/login', passportAuth, function (req, res, next) {
    console.log('success!')
    return res.json({
        state: 200,
        authresult: true,
        info: "info"
    })
});

//登出
router.post('/logout',passportAuth,function(req,res,next){
    req.logout();
    return res.json({
        state: 200,
        authresult: false,
        info: "成功登出"
    })
})

//passport登录中间件
function passportAuth(req, res, next) {
    //自调用匿名函数，将req，res，next直接传递给了匿名函数
    //如果不通过验证，user的值为false
    //info就是在app.js中的done函数中的message
    passport.authenticate('local', function (err, user, info) {

        if (err) { return next(err); }
        if (!user) {
            //验证失败的返回
            var result = {
                state: 200,
                authresult: false,
                info: info
            }
            return res.json(result)
        }
        //可以直接在这里写验证成功的返回
        //用户登录
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            console.log("验证成功")
            return next();
        });
    })(req, res, next);
}

//检测是否登录中间件
function isLogedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', '您尚未登陆！');
        res.redirect("/login");
    }

}


module.exports = router;



