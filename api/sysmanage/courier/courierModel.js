var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var courierSchema = new Schema({
	'couriername' : String,
	'courierdes' : String,
	'district' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'district'
	},
	'region' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'region'
	},
	'courieruser':{
		type:Schema.Types.ObjectId,
		ref:'user'
	}
});

module.exports = mongoose.model('courier', courierSchema);
