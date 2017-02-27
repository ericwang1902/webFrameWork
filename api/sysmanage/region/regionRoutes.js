var express = require('express');
var router = express.Router();
var regionController = require('./regionController.js');

/*
 * GET
 */
router.get('/', regionController.list);

/*
 * GET
 */
router.get('/:id', regionController.show);

/*
 * POST
 */
router.post('/', regionController.create);

/*
 * PUT
 */
router.put('/:id', regionController.update);

/*
 * DELETE
 */
router.delete('/:id', regionController.remove);

module.exports = router;
