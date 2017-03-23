var express = require('express');
var router = express.Router();
var config = require('../frameConfig/frameConfig');


router.get('/',function(req,res){
    res.json({
        jsapiticket:config.jsapiticket
    });
})

module.exports = router;