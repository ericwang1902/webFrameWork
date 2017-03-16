var express = require('express');
var router = express.Router();

var userController = require('../sysmanage/user/userController');

/*
 mobile/bind来绑定用户的openid
 */
router.post('/',userController.userbind);




module.exports = router;
