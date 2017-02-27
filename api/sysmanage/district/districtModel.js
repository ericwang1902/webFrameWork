var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var districtSchema = new Schema({
	'province' : String,
	'city' : String,
	'district' : String
});

module.exports = mongoose.model('district', districtSchema);
