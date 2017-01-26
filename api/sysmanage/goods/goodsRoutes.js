var express = require('express');
var router = express.Router();
var goodsController = require('./goodsController.js');

/*
 * GET
 */
router.get('/', goodsController.list);

/*
 * GET
 */
router.get('/:id', goodsController.show);

/*
 * POST
 */
router.post('/', goodsController.create);

/*
 * PUT
 */
router.put('/:id', goodsController.update);

/*
 * DELETE
 */
router.delete('/:id', goodsController.remove);

module.exports = router;
