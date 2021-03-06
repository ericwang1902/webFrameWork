var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//config
var Config = require('./api/frameConfig/frameConfig');

var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

var dbutils = require('./api/common/dbutils');
dbutils.createconnection();


// routers
var mobileRouter = require('./api/mobile');
var sysmanage = require('./api/sysmanage');
var reportRouter = require('./api/report/reportRouter');


var app = express();
var usercheckmiddle = require('./api/common/usercheckmidlle')



//session管理，使用express-session和connect-mongo就可以了，按照下面的代码设置，如果需要的话去看github页面即可。
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: Config.sessionSecret,
  cookie: { maxAge: 1000 * 100 },//session的过期时间，以此为准
  store: new MongoStore(
    {
      mongooseConnection: mongoose.connection,
      //mongooseConnection: db,
      ttl: 1 * 60 * 60
    }),
  resave: true,
  saveUninitialized: true
}));

//passport和数据加密
var passport = require('passport')//3.验证
var LocalStrategy = require('passport-local').Strategy;//4.登录策略
var bcrypt = require('bcryptjs');//5.数据加密
var usermodel = require('./api/sysmanage/user/userModel');



//解决跨域访问问题的代码，就下面这段中间件
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");

  //七牛
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);

  next();
});


app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  usermodel.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function (username, password, done) {

    usermodel.findOne({ username: username })
      .populate({
        path: "role",//usermodel里的属性名
        selcet: "_id roleName menuList",
        model: "role",//path对应的model名
        populate: {
          path: "menuList",
          select: "_id menuName funcList",
          options: { sort: { menuNum: 1 } },
          model: "menu",
          populate: {
            path: "funcList",
            select: "_id funcNum funcName funcLink",
            options: { sort: { funcNum: 1 } },
            model: "func"
          }

        }
      })
      .populate({
        path: "district",
        model: "district"
      })
      .exec(function (err, user) {
        if (err) return console.error(err);
        //console.log(user)
        if (!user) {
          console.log('用户名不存在');

          return done(null, false, { message: '用户名不存在！！' })
        } else {
       //   console.log(JSON.stringify(user))
          //参数说明：password和user.password进行比较，第三个参数是回调函数
          bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) return console.error(err);

            if (isMatch) {
              console.log("用户名和密码验证成功！")

              return done(null, user);
            } else {
              console.log("密码不匹配！")
              return done(null, false, { message: '密码不匹配！' });
            }
          })
        }
      })

  }
));


//seed
var seed = require('./api/common/seed');
seed.initData();

//下面两个是微信相关的，在本地调试的时候，先注释掉
seed.setSchedule();//设置定时获取apitoken的定时任务
//seed.initTagAndMenu();//初始化tag、菜单

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//http://localhost:8085/MP_verify_fA2T6ARFofWXJQ9b.txt 即可访问
app.use('/mobile', mobileRouter);
app.use('/sysmanage',usercheckmiddle.getUserInfo, sysmanage);
app.use('/report',reportRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
