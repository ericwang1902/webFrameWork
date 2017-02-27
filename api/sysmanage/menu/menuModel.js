var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
	'menuNum':String,
	'menuName': String,
	'funcList': [{
		type: Schema.Types.ObjectId,
		ref: 'func'
	}]//function对象的list
});

module.exports = mongoose.model('menu', menuSchema);
