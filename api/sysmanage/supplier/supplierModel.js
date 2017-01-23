var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var supplierSchema = new Schema({	'suppliernum' : String,	'suppliername' : String,	'supplierdes' : String,	'workers' : Array});

module.exports = mongoose.model('supplier', supplierSchema);
