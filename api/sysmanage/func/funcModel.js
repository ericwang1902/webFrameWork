var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var funcSchema = new Schema({
	'funcName': String,//功能名单
	'funcLink': String,//功能router-link
	'funcNum':Number//序号
});

module.exports = mongoose.model('func', funcSchema);
