var express = require('express');
var router = express.Router();
var fansController = require('./fansController.js');

/*
 * GET
 */
router.get('/', fansController.list);

/*
 * GET
 */
router.get('/:id', fansController.show);

/*
 * POST
 */
router.post('/', fansController.create);

/*
 * PUT
 */
router.put('/:id', fansController.update);

/*
 * DELETE
 */
router.delete('/:id', fansController.remove);

module.exports = router;
