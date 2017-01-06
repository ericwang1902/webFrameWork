var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var functionSchema = new Schema({
	'functionName' : String,
	'functionLink' : String
});

module.exports = mongoose.model('function', functionSchema);
