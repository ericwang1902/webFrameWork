var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var roleSchema = new Schema({
	'roleName' : String,
	'menuList' : Array//menu对象的list
});

module.exports = mongoose.model('role', roleSchema);
