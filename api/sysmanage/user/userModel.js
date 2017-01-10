var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'mobile' : String,
	'password' : String,
	'openid' : String,
	'role' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'role'
	}]
});

module.exports = mongoose.model('user', userSchema);
