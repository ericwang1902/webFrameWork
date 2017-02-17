//framework全局开发配置文件


module.exports={
    //数据库名称
    databaseName:"frameworkDatabase",
    //session的secret
    sessionSecret:"frameworkSecret",
    //微信appid和appsecret
    wechatConfig:{
        appid:"wx94e3a09e4149b262",
        appsecret:"6e428e808f1620210ef32a2d2313a038"
    },
    //微信创建菜单url
    wechatMenuURL:"https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token=",
    //微信用户标签url
    wechatTagURL:"https://api.weixin.qq.com/cgi-bin/tags/create?access_token=",
    //获取微信全局的accesstoken的网址，这需要修改！！！！！
    wechatTokenURL:"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx94e3a09e4149b262&secret=6e428e808f1620210ef32a2d2313a038"

}