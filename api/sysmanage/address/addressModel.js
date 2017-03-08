var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var addressSchema = new Schema({
	'detail' : String,
	'phone' : String,
	'name':String,
	'region' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'region'
	},
	'fans':{
		type: Schema.Types.ObjectId,
		ref: 'fans'
	}
});

module.exports = mongoose.model('address', addressSchema);
