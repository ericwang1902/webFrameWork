var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var fansSchema = new Schema({
	'fannickname' : String,
	'fanopenid' : String,
	'orders' : Array,
	'points' : Number,
	'coupons' : Array
});

module.exports = mongoose.model('fans', fansSchema);
