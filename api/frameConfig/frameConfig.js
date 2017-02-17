//framework全局开发配置文件

module.exports={
    //数据库名称
    databaseName:"frameworkDatabase",
    //session的secret
    sessionSecret:"frameworkSecret",
    //微信appid和appsecret
    wechatConfig:{
        appid:"wx94e3a09e4149b262",
        appsecret:"2301f292e2765b44890dba2f845c6f3a"
    },
    //微信创建菜单url
    wechatMenuURL:"https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token="
}