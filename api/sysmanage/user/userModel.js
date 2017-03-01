var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'nickname':String,
	'mobile' : String,
	'password' : String,
	'openid' : String,
	'district':{
	 	type: Schema.Types.ObjectId,
	 	ref: 'district'
	},
	'role' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'role'
	}]
});

module.exports = mongoose.model('user', userSchema);
