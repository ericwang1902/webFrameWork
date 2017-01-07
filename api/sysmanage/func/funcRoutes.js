var express = require('express');
var router = express.Router();
var funcController = require('./funcController.js');

/*
 * GET
 */
router.get('/', funcController.list);

/*
 * GET
 */
router.get('/:id', funcController.show);

/*
 * POST
 */
router.post('/', funcController.create);

/*
 * PUT
 */
router.put('/:id', funcController.update);

/*
 * DELETE
 */
router.delete('/:id', funcController.remove);

module.exports = router;
