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
    //微信创建基础菜单的url
    wechatSelfMenu:"https://api.weixin.qq.com/cgi-bin/menu/create?access_token=",
    //微信删除所有菜单url
    wechatTotalDelMenu:"https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=",
    //微信创建个性化菜单url
    wechatCondictionMenuURL:"https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token=",
    //微信删除菜单url，是删除所有自定义菜单
    wechatDeleteConditionMenuURL:"https://api.weixin.qq.com/cgi-bin/menu/delconditional?access_token=",

    //微信用户标签url
    wechatTagURL:"https://api.weixin.qq.com/cgi-bin/tags/create?access_token=",
    //查询用户标签url
    wechatTagCheckURL:"https://api.weixin.qq.com/cgi-bin/tags/get?access_token",
    //获取微信全局的accesstoken的网址，这需要修改！！！！！
    wechatTokenURL:"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx94e3a09e4149b262&secret=6e428e808f1620210ef32a2d2313a038",
    //全局token
    apiToken:'',
 
    
    
    //粉丝菜单配置
    fansMenu:{
        button: [
                {
                    type: "click", 
                    name: "粉丝", 
                    key: "V1001_TODAY_MUSIC"
                }
            ] 
    },
    //店主菜单配置
    shopperOwenerMenu:{
        button: [
                {
                    type: "click", 
                    name: "店主", 
                    key: "V1001_TODAY_MUSIC"
                }
            ],
            matchrule:{
                tag_id:100
            }
    },
    //管理员菜单配置
    adminMenu:{
        button: [
                {
                    type: "click", 
                    name: "管理员", 
                    key: "V1001_TODAY_MUSIC"
                }
            ],
            matchrule:{
                tag_id:103
            }
    },
    //配送员菜单配置
    courierMenu:{
        button: [
                {
                    type: "click", 
                    name: "配送员", 
                    key: "V1001_TODAY_MUSIC"
                }
            ],
            matchrule:{
                tag_id:102
            }
    }

    


}