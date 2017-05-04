//framework全局开发配置文件
//var mobileBaseURL = 'http://localhost:8090/#/';

var mobileBaseURL = 'http://mst.robustudio.com/#/';

module.exports = {
    wxjsurl: mobileBaseURL.split('#')[0],
    //数据库名称
    databaseName: "frameworkDatabase",
    //session的secret
    sessionSecret: "frameworkSecret",
    //微信appid和appsecret
    wechatConfig: {
        appid: "wx94e3a09e4149b262",
        appsecret: "6e428e808f1620210ef32a2d2313a038"
    },
    //微信支付商户号
    wechatmchid: "1437384602",
    //微信支付回调网址
    wechaturl: "http://aft.robustudio.com/sysmanage/wechatpayback",
    //微信创建基础菜单的url
    wechatSelfMenu: "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=",
    //微信删除所有菜单url
    wechatTotalDelMenu: "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=",
    //微信查询所有菜单url
    wechatGetMenuList: "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=",
    //微信创建个性化菜单url
    wechatCondictionMenuURL: "https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token=",
    //微信删除菜单url，是删除所有自定义菜单
    wechatDeleteConditionMenuURL: "https://api.weixin.qq.com/cgi-bin/menu/delconditional?access_token=",

    //微信用户标签url
    wechatTagURL: "https://api.weixin.qq.com/cgi-bin/tags/create?access_token=",
    //查询用户标签url
    wechatTagCheckURL: "https://api.weixin.qq.com/cgi-bin/tags/get?access_token=",
    //获取微信全局的accesstoken的网址，这需要修改！！！！！
    wechatTokenURL: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx94e3a09e4149b262&secret=6e428e808f1620210ef32a2d2313a038",

    //全局token
    apiToken: '',
    //根据微信的accesstoken，获取jsapiticket
    wechatJSApitTicketURL: "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=",
    //全局jsapiticket
    jsapiticket: '',
    //粉丝分组标签，需与条件菜单中的menuName一致
    Tags: [{ name: 'ADMIN' }, { name: 'AGENT' }, { name: 'SHOPPER' }, { name: 'COURIER' }],
    //微信接口获取的tag
    TagsFromWechat: {},
    //粉丝菜单配置
    baseMenu: {
        button: [
            {
                type: "view",
                name: "🐻下午茶",
                url: "http://aft.robustudio.com/mobile/index"
            },
            {
                type: "view",
                name: "我的订单",
                url: "http://aft.robustudio.com/mobile/fans"
            },
            {
                "name": "找小熊",
                "sub_button": [
                    {
                        "type": "view",
                        "name": "对小熊说",
                        "url": "https://static.meiqia.com/dist/standalone.html?eid=56981&agentid=37ee846ef642e7cc9fe397d948e833eb"
                    },
                    {
                        "type": "view",
                        "name": "联系小熊",
                        "url": "http://mp.weixin.qq.com/s/hhc1vWXuca3dbt9Fm124Ag"
                    }
                    //,
                    // {
                    //     "type": "view",
                    //     "name": "联系小熊",
                    //     "url": "http://mp.weixin.qq.com/s/hhc1vWXuca3dbt9Fm124Ag"
                    // }
                ]
            }
        ]
    },



    //条件菜单，menuName需与粉丝分组标签的name一致
    conditionalMenus: [
        {
            menuName: 'SHOPPER',
            menu: {
                button: [
                    {
                        type: "view",
                        name: "店主",
                        url: "http://aft.robustudio.com/mobile/shopper"
                    }
                ],
                matchrule: {
                    tag_id: ''
                }
            }
        }
        ,
        {
            menuName: 'ADMIN',
            menu: {
                button: [
                    {
                        type: "view",
                        name: "管理员",
                        url: "http://aft.robustudio.com/mobile/admin"
                    }
                ],
                matchrule: {
                    tag_id: ''
                }
            }
        }
        ,
        {
            menuName: 'COURIER',
            menu: {
                button: [
                    {
                        type: "view",
                        name: "配送员",
                        url: "http://aft.robustudio.com/mobile/courier"
                    }
                ],
                matchrule: {
                    tag_id: ''
                }
            }
        },
        {
            menuName: 'AGENT',
            menu: {
                button: [
                    {
                        type: "view",
                        name: "区域代理",
                        url: "http://aft.robustudio.com/mobile/agent"
                    }
                ],
                matchrule: {
                    tag_id: ''
                }
            }
        }

    ],
    //发送模板消息网址
    wechatTemplateMsg: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=",



    //mobile部分的url
    mobileUserInitURL: mobileBaseURL + 'initfan',

    mobildUserAddlist: mobileBaseURL + 'addlist',

    mobileUserHome: mobileBaseURL + 'home',

    //用户绑定
    mobileUserBind: mobileBaseURL + 'userbind',
    //店主的移动端页面
    mobileShopper: mobileBaseURL + 'shopowner',
    //配送员的移动端页面
    mobileCourier: mobileBaseURL + 'courier',
    //管理员的移动端页面
    mobileAdmin: mobileBaseURL + 'admin',
    //区域代理的移动端页面
    mobileAgent: mobileBaseURL + 'agent',
    //粉丝的页面
    mobileTempFans: mobileBaseURL + 'orderlist',
    //粉丝区域设置界面
    mobiledistictURL:mobileBaseURL+'districtform',

    //模板消息id
    templateid: {
        shopOrderId: "FWQV2RtWbgSE5IZxt7fi86wA3jwNKohNlL-c4mRPxBI",//店铺订单使用的模板消息
        fansOrderId: "qTAFxHm0RvJwxhVgNonCHuSurwBVOPoaoZXx9RkSqzI",//给粉丝的订单状态通知 
        courierId: "FWQV2RtWbgSE5IZxt7fi86wA3jwNKohNlL-c4mRPxBI",//配送员的模板消息
        agentOrderId: "EomQuk85iSHk6qoB9GcBBklixqEMJl1UO-x5k2pVLeA"//发送给管理员的通知
    }





}