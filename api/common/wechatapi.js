
var request = require('request')
var config =require('../frameConfig/frameConfig')

//获取全局的token
function getApiToken(){
    var tokenOptions = {
        url: config.wechatTokenURL,
        method: 'GET'
    }
    request(tokenOptions, function (err, response, body) {
        console.log('tokenOptions:' + JSON.stringify(body))
        config.apiToken = body.access_token;
        console.log('config.apiToken:' + JSON.stringify(body))
        createTag("fans");//粉丝分组
        createTag("shopowner");//店主
        createTag("courier");//配送员
        createTag("admin");//管理员
    })
}

//创建菜单
function createMenu() {
    var menuOptions = {
        url: config.wechatMenuURL + config.apiToken,
        method: 'POST',
        json: true,
        body: {

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