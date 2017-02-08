var express = require('express');
var router = express.Router();
var orderController = require('./orderController.js');

/*
 * GET
 */
router.get('/', orderController.list);

/*
 * GET
 */
router.get('/:id', orderController.show);

/*
 * POST
 */
router.post('/', orderController.create);

/*
 * PUT
 */
router.put('/:id', orderController.update);

/*
 * DELETE
 */
router.delete('/:id', orderController.remove);

module.exports = router;
