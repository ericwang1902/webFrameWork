var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var funcSchema = new Schema({
	'funcName' : String,
	'funcLink' : String
});

module.exports = mongoose.model('function', funcSchema);
