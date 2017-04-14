var express = require('express');
var router = express.Router();
var goodsController = require('./goodsController.js');

/*
 * GET
 * /sysmanage/goodslistall
 */
router.get('/', goodsController.listall);


module.exports = router;
