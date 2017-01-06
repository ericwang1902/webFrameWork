var express = require('express');
var router = express.Router();
var menuController = require('./menuController.js');

/*
 * GET
 */
router.get('/', menuController.list);

/*
 * GET
 */
router.get('/:id', menuController.show);

/*
 * POST
 */
router.post('/', menuController.create);

/*
 * PUT
 */
router.put('/:id', menuController.update);

/*
 * DELETE
 */
router.delete('/:id', menuController.remove);

module.exports = router;
