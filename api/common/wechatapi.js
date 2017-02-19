
var request = require('request')
var config =require('../frameConfig/frameConfig')

//获取全局的token
function getApiToken(){
    var tokenOptions = {
        url: config.wechatTokenURL,
        method: 'GET'
    }
    //body返回的是string
    request(tokenOptions, function (err, response, body) {
        console.log('tokenOptions:' + JSON.stringify(body))
        config.apiToken = JSON.parse(body).access_token;
        console.log('config.apiToken:' + JSON.parse(body).access_token)
        //createTag("fans");//粉丝分组
        //createTag("shopowner");//店主
        //createTag("courier");//配送员
        //createTag("admin");//管理员
        createMenu();
    })
}

//创建菜单
function createMenu() {
    var menuOptions = {
        url: config.wechatMenuURL + config.apiToken,
        method: 'POST',
        json: true,
        body: {
            
            button: [
                {
                    type: "click", 
                    name: "今日歌曲", 
                    key: "V1001_TODAY_MUSIC"
                }, 
                {
                    name: "菜单", 
                    sub_button: [
                        {
                            type: "view", 
                            name: "搜索", 
                            url: "http://www.soso.com/"
                        }, 
                        {
                            type: "view", 
                            name: "视频", 
                            url: "http://v.qq.com/"
                        }, 
                        {
                            type: "click", 
                            name: "赞一下我们", 
                            key: "V1001_GOOD"
                        }
                    ]
                }
            ], 
            matchrule: {
                tag_id: "101"
            }
        
        }
    }
    request(menuOptions, function (err, response, body) {
        console.log('createmenu URL:' + menuOptions.url)
            console.log("创建菜单："+JSON.stringify(body))
       
    })

}

//创建用户标签
function createTag(tagName){
    console.log("tag url:"+config.wechatTagURL + config.apiToken)
    var groupOptions = {
        url: config.wechatTagURL + config.apiToken,
        method: 'POST',
        json: true,
        body: {       
                tag:{
                    name:tagName
                }
        }
    }
    request(groupOptions,function(err,response,body){
        console.log("创建tag："+JSON.stringify(body))
        
    })
}
//查询用户tag
function checkTag(){

}


module.exports={
    getApiToken
}