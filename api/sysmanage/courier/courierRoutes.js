var express = require('express');
var router = express.Router();
var courierController = require('./courierController.js');

/*
 * GET
 */
router.get('/', courierController.list);

/*
 * GET
 */
router.get('/:id', courierController.show);

/*
 * POST
 */
router.post('/', courierController.create);

/*
 * PUT
 */
router.put('/:id', courierController.update);

/*
 * DELETE
 */
router.delete('/:id', courierController.remove);

module.exports = router;
