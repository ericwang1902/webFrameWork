var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var suiteSchema = new Schema({
	'suitenum' : String,
	'suiteorder':Number,//套餐排序
	'suitename' : String,
	'suitedes' : String,
	'suitephoto' : String,
	'suiteprice' : Number,
	'suiteshowprice':Number,
	'suitestate' : Boolean,
	'suitetype' : String,
	'salesnum' : String,
	'district': {
		type: Schema.Types.ObjectId,
		ref: 'district'
	},
	'goodslist' : [{
		type: Schema.Types.ObjectId,
		ref: 'goods'
	}]
});

module.exports = mongoose.model('suite', suiteSchema);
