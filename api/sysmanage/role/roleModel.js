var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new Schema({
	'roleName': String,
	'roleDes': String,
	'menuList': [{
		type: Schema.Types.ObjectId,
		ref: 'menu'
	}]//menu对象的list
});

module.exports = mongoose.model('role', roleSchema);
