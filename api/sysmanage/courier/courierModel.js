var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var courierSchema = new Schema({	'couriername' : String,	'courierdes' : String,	'mobile' : String,	'district' : {	 	type: Schema.Types.ObjectId,	 	ref: 'district'	},	'region' : {	 	type: Schema.Types.ObjectId,	 	ref: 'region'	}});

module.exports = mongoose.model('courier', courierSchema);
