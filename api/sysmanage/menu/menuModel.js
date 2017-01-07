var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var menuSchema = new Schema({
	'menuName' : String,
	'funcList' : Array//function对象的list
});

module.exports = mongoose.model('menu', menuSchema);
