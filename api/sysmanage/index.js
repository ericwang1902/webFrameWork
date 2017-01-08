var express = require('express');
var router = express.Router();

var passport  = require('passport');

var funcRouter = require('./func/funcRoutes');
var menuRouter = require('./menu/menuRoutes');
var roleRouter = require('./role/roleRoutes');
var userRouter = require('./user/userRoutes');

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





//**********************************测试区***************************
//自定义回调函数
router.post('/login', passportAuth, function (req, res, next) {
    console.log('success!')
    return res.json({
        state: 200,
        authresult: true,
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



