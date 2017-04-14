var express = require('express');
var router = express.Router();
var goodsController = require('./goods/goodsController.js');
var supplierController = require('./supplier/supplierController')

/*
 * GET
 * /sysmanage/formlistdata
 */
router.get('/goodslistall', goodsController.listall);

router.get('/supplierslistall', supplierController.listall);

module.exports = router;
