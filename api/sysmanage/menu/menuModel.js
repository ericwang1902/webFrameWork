var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var menuSchema = new Schema({
	'menuName' : String,
	'functionList' : Array//function对象的list
});

module.exports = mongoose.model('menu', menuSchema);
