var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var addressSchema = new Schema({	'detail' : String,	'phone' : String,	'region' : {	 	type: Schema.Types.ObjectId,	 	ref: 'region'	}});

module.exports = mongoose.model('address', addressSchema);
