var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var funcSchema = new Schema({
	'funcName': String,//功能名单
	'funcLink': String//功能router-link
});

module.exports = mongoose.model('function', funcSchema);
