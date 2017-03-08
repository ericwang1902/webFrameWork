var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var fansSchema = new Schema({
	'fannickname' : String,
	'fanopenid' : String,
	'orders' : Array,
	'points' : Number,
	'coupons' : Array,
	'district': {
		type: Schema.Types.ObjectId,
		ref: 'district'
	},
	'address':{
		type: Schema.Types.ObjectId,
		ref: 'address'
	}
});

module.exports = mongoose.model('fans', fansSchema);
