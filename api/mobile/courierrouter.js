var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    return res.send("courier");
});



module.exports = router;