var express = require('express');
var router = express.Router();
var functionController = require('./functionController.js');

/*
 * GET
 */
router.get('/', functionController.list);

/*
 * GET
 */
router.get('/:id', functionController.show);

/*
 * POST
 */
router.post('/', functionController.create);

/*
 * PUT
 */
router.put('/:id', functionController.update);

/*
 * DELETE
 */
router.delete('/:id', functionController.remove);

module.exports = router;
