
var request = require('request')
var config =require('../frameConfig/frameConfig')
var async = require('async')

//获取全局的token
function getApiToken(callback){
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
function initMenu(){
    async.waterfall([
        function(callback) {
            //删除菜单
            deleteMenu(function(result){
                if(result){
                    callback(null,result);
                }else{
                    callback("err","");
                }
            });//回调函数        
        },
        function(deleteMenuResult, callback) {
            //创建基础菜单,即普通粉丝菜单
            createMenu(config.wechatSelfMenu+config.apiToken,config.fansMenu,function(result){
                if(result){
                    callback(null,result);
                }else{
                    callback("err","");
                }
            });
        },
        function(fansMenuResult, callback) {
            //创建店主菜单
            createMenu(config.wechatCondictionMenuURL+config.apiToken,config.shopperOwenerMenu,function(result){
                if(result){
                    callback(null,result);
                }else{
                    callback("err","");
                }
            });
        },
        function(shopperOwenerMenuResult, callback) {
            //创建配送员菜单
            createMenu(config.wechatCondictionMenuURL+config.apiToken,config.courierMenu,function(result){
                if(result){
                    callback(null,result);
                }else{
                    callback("err","");
                }
            });
        },
        function(courierMenuResult, callback) {
            //创建管理员菜单
            createMenu(config.wechatCondictionMenuURL+config.apiToken,config.adminMenu,function(result){
                if(result){
                    callback(null,result);
                }else{
                    callback("err","");
                }
            });
        }
    ], function (err, result) {
        if(err){
            console.log("创建菜单出错！")
        }else{
            console.log("菜单创建成功！")
        }

    });
}

//删除所有菜单
function deleteMenu(callbackFunc){
    var deleteMenuOptions = {
        url: config.wechatTotalDelMenu+config.apiToken,
        method: 'GET'
    }
    request(deleteMenuOptions,function(err,response,body){
        if(err){
            console.log('删除菜单出错');
            callbackFunc(false);
        }else{
            console.log("删除菜单的返回结果："+body);
            callbackFunc(true)
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
            callbackFunc(false);
        }  
        else{
            console.log(JSON.stringify(body));
            callbackFunc(true);
        }
    })
}

//查询用户tag
function InitTag(){
    //查询是否已经创建了tag
    var getTagOptions = {
        url: config.wechatTagCheckURL+config.apiToken,
        method: 'GET'
    }
    request(getTagOptions,function(err,response,body){
        console.log("查询tag："+body);
        var tags = JSON.parse(body).tags;//获取tags数组
        for(var i = 0;i<config.Tags.length;i++){
            if(!tags.find((n) => {n.name===config.Tags[i]}))//如果没有该分组
            {
                //新建分组
                createTag(config.Tags[i]);
            }
            else{
                console.log(config.Tags[i]+"已创建！")
            }
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


module.exports={
    getApiToken,
    initMenu,
    InitTag
    
}