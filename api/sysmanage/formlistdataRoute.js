var express = require('express');
var router = express.Router();
var goodsController = require('./goods/goodsController.js');

/*
 * GET
 * /sysmanage/formlistdata
 */
router.get('/goodslistall', goodsController.listall);


module.exports = router;
