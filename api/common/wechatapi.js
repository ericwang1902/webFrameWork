
var request = require('request')
var config =require('../frameConfig/frameConfig')
var async = require('async')

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
        //createMenu(config.fansMenu);//创建粉丝菜单
    })
}



//创建菜单：
function initMenu(){
    async.waterfall([
        function(callback) {
            //删除菜单
            deleteMenu(callback(err, result));//回调函数        
        },
        function(deleteMenuResult, callback) {
            //创建基础菜单,即普通粉丝菜单
            createMenu(config.wechatSelfMenu,config.fansMenu,callback(err,result));
        },
        function(fansMenuResult, callback) {
            //创建店主菜单
            createMenu(config.wechatCondictionMenuURL,config.shopperOwenerMenu,callback(err,result));
        },
        function(shopperOwenerMenuResult, callback) {
            //创建配送员菜单
            createMenu(config.wechatCondictionMenuURL,config.courierMenu,callback(err,result));
        },
        function(courierMenuResult, callback) {
            //创建管理员菜单
            createMenu(config.wechatCondictionMenuURL,config.adminMenu,callback(err,result));
        }
    ], function (err, result) {
        if(err){
            console.log("创建菜单出错！")
        }else{
            console.log("菜单创建成功！")
        }

    });
}

//删除菜单
function deleteMenu(callbackFunc){
    request(function(err,response,body){
        if(err){
            console.log('删除菜单出错');
            callbackFunc(null,false);
        }else{
            console.log("删除菜单的返回结果："+body);
            callbackFunc(null,true)
        }
    })
}

//创建菜单接口
function createMenu(menuUrl,menu,callbackFunc){
    var menuOptions = {
        url: menuUrl,
        method: 'POST',
        json: true,
        body: menu
    }
    request(menuOptions, function (err, response, body) {
        console.log('createmenu URL:' + menuOptions.url)
        console.log("创建菜单："+JSON.stringify(body))
        if(err){
            console.log("菜单创建出错了");
            callbackFunc(null,false);
        }  
        else{
            console.log(JSON.stringify(body));
            callbackFunc(null,true);
        }
    })
}




//创建用户标签,需要补充检查tag，判断是否创建tag的过程。
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
    getApiToken,
    initMenu
    
}