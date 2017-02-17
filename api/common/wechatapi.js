
var request = require('request')
var config =require('../frameConfig/frameConfig')

var getApiToken=function(){
    var tokenOptions = {
        url: config.wechatTokenURL,
        method: 'GET'
    }
    request(tokenOptions, function (err, response, body) {
        console.log('tokenOptions:' + JSON.stringify(body))
        
    })
}

module.exports={
    getApiToken:getApiToken
}