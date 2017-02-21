
var request = require('request')
var config = require('../frameConfig/frameConfig')
var async = require('async')

var WechatAPI = require('wechat-api');

var api = new WechatAPI(config.wechatConfig.appid, config.wechatConfig.appsecret);

//获取全局的token
function getApiToken(callback) {
    var tokenOptions = {
        url: config.wechatTokenURL,
        method: 'GET'
    }
    //body返回的是string
    request(tokenOptions, function (err, response, body) {
        console.log('tokenOptions:' + JSON.stringify(body))
        config.apiToken = JSON.parse(body).access_token;
        console.log('config.apiToken:' + JSON.parse(body).access_token)
        callback();
    })
}




//创建菜单：
function initMenu(tagsFromWechat) {
    async.waterfall([
        //检查是否已经有了菜单(包括基础菜单和个性化菜单)
        function (callback) {
            var getMenuOptions = {
                url: config.wechatGetMenuList + config.apiToken,
                method: 'GET'
            }
            request(getMenuOptions,function(err,response,body){
                console.log("查询menulist："+body);
                //1.如果有tag自定义菜单
                if(JSON.parse(body).conditionalmenu){
                    var conditionalMenuList = JSON.parse(body).conditionalmenu;
                    //2.拿自定义菜单list匹配tags
                    var tagsList = config.TagsFromWechat;
                    async.eachOf(conditionalMenuList,function(value,key,callback1){
                        //如果有匹配不到的，就进行创建
                        console.log("tagsList:"+JSON.stringify(tagsList));//这里的id是数值
                        console.log("conditionalMenuList:"+JSON.stringify(conditionalMenuList));//这里的id是字符串
                        if(!tagsList.find(d=>d.id == value.matchrule.group_id)){
                            callback1("E001");
                        }else{
                            callback1();
                        }
                    },function(err){
                        if (err) {
                            console.error(err.message);
                            //下一步创建
                             callback(null,true);//到下一步进行创建
                        }
                        else{
                            callback("已经有了tag自定义menu，无需再创建！")
                        }

                    })
                    

                }else{
                    callback(null,true);//到下一步进行创建
                }

            })
        },
        function (ifMenu, callback) {
            //删除菜单
            deleteMenu(function (result) {
                if (result) {
                    callback(null, result);
                } else {
                    callback("err", "");
                }
            });//回调函数        
        },

        function (deleteMenuResult, callback) {
            //创建基础菜单,即普通粉丝菜单
            createMenu(config.wechatSelfMenu + config.apiToken, config.baseMenu, function (result) {
                if (result) {
                    callback(null, result);
                } else {
                    callback("err", "");
                }
            });
        },

        function (deleteMenuResult, callback) {
            //eachOf来循环tagsFromWechat创建菜单
            console.log('tagsFromWechat:' + JSON.stringify(tagsFromWechat));
            async.eachOf(tagsFromWechat, function (value, key, callback1) {
                //根据tags的id来复制menus，构造创建数据
                console.log('value:' + JSON.stringify(value));
                var menuTemp1 = config.conditionalMenus.find(d => d.menuName === value.name);
                console.log('value:' + JSON.stringify(value));
                console.log('menuTemp1:' + JSON.stringify(menuTemp1));


                if (menuTemp1) {
                    menuTemp1.menu.matchrule.tag_id = value.id;
                    createMenu(config.wechatCondictionMenuURL + config.apiToken, menuTemp1.menu, function (result) {
                        if (result) {
                            callback1();
                        } else {
                            callback1("创建个性化菜单出错！")
                        }
                    });
                }


            }, function (err) {
                if (err) {
                    console.log(err);
                    callback(err, "");//waterfall的回调
                }
                callback(null, true);//waterfall的回调
            })
        },




    ], function (err, result) {
        if (err) {
            console.log("创建菜单出错！")
        } else {
            console.log("菜单创建成功！")
        }

    });
}

//删除所有菜单
function deleteMenu(callbackFunc) {
    var deleteMenuOptions = {
        url: config.wechatTotalDelMenu + config.apiToken,
        method: 'GET'
    }
    request(deleteMenuOptions, function (err, response, body) {
        if (err) {
            console.log('删除菜单出错');
            callbackFunc(false);
        } else {
            console.log("删除菜单的返回结果：" + body);
            callbackFunc(true)
        }
    })
}

//创建菜单接口
function createMenu(menuUrl, menu, callbackFunc) {
    var menuOptions = {
        url: menuUrl,
        method: 'POST',
        json: true,
        body: menu
    }
    request(menuOptions, function (err, response, body) {
        console.log('createmenu URL:' + menuOptions.url)
        console.log("创建菜单：" + JSON.stringify(body))
        if (err) {
            console.log("菜单创建出错了");
            callbackFunc(false);
        }
        else {
            console.log(JSON.stringify(body));
            callbackFunc(true);
        }
    })
}

//查询用户tag
function InitTag(initMenuCallback) {
    //查询是否已经创建了tag
    var getTagOptions = {
        url: config.wechatTagCheckURL + config.apiToken,
        method: 'GET'
    }
    request(getTagOptions, function (err, response, body) {
        console.log("查询tag：" + body);
        var tags = JSON.parse(body).tags;//获取tags数组
        
        async.eachOf(config.Tags, function (value, key, callback) {
            if (!tags.find(d => d.name === value.name)) {
                createTag(config.Tags.find(d => d.name === value.name).name, callback);
            } else {
                console.log(value.name + "已创建！")
                callback();
            }
        }, function (err) {
            if (err) console.error(err.message);
            console.log("initTag~~~异步全部完成，下面到了menu创建")
            //经过上述async.eachof代码段，就完成了tag的新建，在系统里就有了tag数据了

            //下面是取出最新的tag数组，获取到tags的id，根据id来创建menu
            request(getTagOptions, function (err, response, body) {
                var finalTags = JSON.parse(body).tags;
                config.TagsFromWechat = finalTags;//将tags存入全局
                console.log('finalTags:' + finalTags);
                initMenuCallback(finalTags);//创建菜单的回调
            })

        })

    })

}

//创建用户标签,需要补充检查tag，判断是否创建tag的过程。
function createTag(tagName, callback) {
    console.log("tag url:" + config.wechatTagURL + config.apiToken)
    var groupOptions = {
        url: config.wechatTagURL + config.apiToken,
        method: 'POST',
        json: true,
        body: {
            tag: {
                name: tagName
            }
        }
    }
    request(groupOptions, function (err, response, body) {
        console.log("创建tag：" + JSON.stringify(body))
        callback();
    })
}

//发送新订单模板消息
function sendNewOrderTemplateMsg(openid) {
    console.log("openid~~~~~:" + openid)
    var templateId = "FWQV2RtWbgSE5IZxt7fi86wA3jwNKohNlL-c4mRPxBI";
    var url1 = "http://baidu.com";
    var postData = {
        "first": {
            "value": "恭喜你购买成功！",
            "color": "#173177"
        },
        "tradeDateTime": {
            "value": "巧克力",
            "color": "#173177"
        },
        "orderType": {
            "value": "39.8元",
            "color": "#173177"
        },
        "customerInfo": {
            "value": "2014年9月22日",
            "color": "#173177"
        },
        "orderItemName": {
            "value": "2014年9月22日",
            "color": "#173177"
        },
        "orderItemData": {
            "value": "2014年9月22日",
            "color": "#173177"
        },
        "remark": {
            "value": "欢迎再次购买！",
            "color": "#173177"
        }
    }

    api.sendTemplate(openid, templateId, url1, postData, function (err, result) {
        if (err) {
            console.log(err);

        }
        else {
            console.log('result:' + JSON.stringify(result));
        }
    });

}


module.exports = {
    getApiToken,
    initMenu,
    InitTag,
    sendNewOrderTemplateMsg

}