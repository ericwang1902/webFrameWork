var express = require('express');
var router = express.Router();
var goodsController = require('./goodsController.js');

/*
 * GET
 * /sysmanage/goodslistroute/goodslist
 */
router.get('/', goodsController.listall);


module.exports = router;
