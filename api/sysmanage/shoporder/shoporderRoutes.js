var express = require('express');
var router = express.Router();
var shoporderController = require('./shoporderController.js');

/*
 * GET
 */
router.get('/', shoporderController.list);

/*
 * GET
 */
router.get('/:id', shoporderController.show);

/*
 * POST
 */
router.post('/', shoporderController.create);

/*
 * PUT
 */
router.put('/:id', shoporderController.update);

/*
 * DELETE
 */
router.delete('/:id', shoporderController.remove);

module.exports = router;
