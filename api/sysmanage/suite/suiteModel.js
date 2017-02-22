var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var suiteSchema = new Schema({
	'suitenum' : String,
	'suitename' : String,
	'suitedes' : String,
	'suitephoto' : String,
	'suiteprice' : Number,
	'suitestate' : Boolean,
	'suitetype' : String,
	'salesnum' : String,
	'goodslist' : [{
		type: Schema.Types.ObjectId,
		ref: 'goods'
	}]
});

module.exports = mongoose.model('suite', suiteSchema);
