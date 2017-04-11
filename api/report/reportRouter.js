var express = require('express');
var router = express.Router();
var supplierdaily = require('./supplierdaily');

//report/supplierdaily
router.get('/supplierdaily', supplierdaily.getSupplier);
