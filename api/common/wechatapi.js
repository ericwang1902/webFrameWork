
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
        createMenu();//测试～～～～
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
function createTag(req,res,next){
    console.log("tag url:"+config.wechatTagURL + req.session.access_token)
    var groupOptions = {
        url: config.wechatTagURL + req.session.access_token,
        method: 'POST',
        json: true,
        body: {       
                tag:{
                    name:"test"
                }
        }
    }
    request(groupOptions,function(err,response,body){
        console.log("创建tag："+JSON.stringify(body))
        
    })
}


module.exports={
    getApiToken
}