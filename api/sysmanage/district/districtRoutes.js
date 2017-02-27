var express = require('express');
var router = express.Router();
var districtController = require('./districtController.js');

/*
 * GET
 */
router.get('/', districtController.list);

/*
 * GET
 */
router.get('/:id', districtController.show);

/*
 * POST
 */
router.post('/', districtController.create);

/*
 * PUT
 */
router.put('/:id', districtController.update);

/*
 * DELETE
 */
router.delete('/:id', districtController.remove);

module.exports = router;
