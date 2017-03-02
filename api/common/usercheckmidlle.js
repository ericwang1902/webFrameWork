var usermodel = require('../sysmanage/user/userModel')

var getUserInfo = function (req, res, next) {
    if (req.query.userid) {
        var userid = req.query.userid;
        usermodel.findOne({ _id: userid })
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
            .exec(function (err, userinfo) {
                if (err) console.log(err);
                if (userinfo) {
                    req.user = userinfo;
                    console.log("中间件：" + JSON.stringify(req.user));
                    return next();
                }
            })
    }else{
        console.log('无用户id参数')
        return next();
    }




}

module.exports = { getUserInfo }