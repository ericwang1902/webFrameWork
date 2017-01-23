var express = require('express');
var router = express.Router();
var supplierController = require('./supplierController.js');

/*
 * GET
 */
router.get('/', supplierController.list);

/*
 * GET
 */
router.get('/:id', supplierController.show);

/*
 * POST
 */
router.post('/', supplierController.create);

/*
 * PUT
 */
router.put('/:id', supplierController.update);

/*
 * DELETE
 */
router.delete('/:id', supplierController.remove);

module.exports = router;
