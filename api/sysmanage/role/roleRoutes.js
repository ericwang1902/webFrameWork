var express = require('express');
var router = express.Router();
var roleController = require('./roleController.js');

/*
 * GET
 */
router.get('/', roleController.list);

/*
 * GET
 */
router.get('/:id', roleController.show);

/*
 * POST
 */
router.post('/', roleController.create);

/*
 * PUT
 */
router.put('/:id', roleController.update);

/*
 * DELETE
 */
router.delete('/:id', roleController.remove);

module.exports = router;
