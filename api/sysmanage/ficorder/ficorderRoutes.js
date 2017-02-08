var express = require('express');
var router = express.Router();
var ficorderController = require('./ficorderController.js');

/*
 * GET
 */
router.get('/', ficorderController.list);

/*
 * GET
 */
router.get('/:id', ficorderController.show);

/*
 * POST
 */
router.post('/', ficorderController.create);

/*
 * PUT
 */
router.put('/:id', ficorderController.update);

/*
 * DELETE
 */
router.delete('/:id', ficorderController.remove);

module.exports = router;
