var express = require('express');
var router = express.Router();
var suiteController = require('./suiteController.js');

/*
 * GET
 */
router.get('/', suiteController.list);

/*
 * GET
 */
router.get('/:id', suiteController.show);

/*
 * POST
 */
router.post('/', suiteController.create);

/*
 * PUT
 */
router.put('/:id', suiteController.update);

/*
 * DELETE
 */
router.delete('/:id', suiteController.remove);

module.exports = router;
