var express = require('express');
var router = express.Router();
var addressController = require('./addressController.js');

/*
 * GET
 */
router.get('/', addressController.list);

/*
 * GET
 */
router.get('/:id', addressController.show);

/*
 * POST
 */
router.post('/', addressController.create);

/*
 * PUT
 */
router.put('/:id', addressController.update);

/*
 * DELETE
 */
router.delete('/:id', addressController.remove);

module.exports = router;
