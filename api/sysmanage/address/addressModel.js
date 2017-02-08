var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var addressSchema = new Schema({
	'province' : String,
	'city' : String,
	'district' : String,
	'street' : String,//街道、园区、小区、单位
	'details' : String,
	'phone' : String
});

module.exports = mongoose.model('address', addressSchema);
