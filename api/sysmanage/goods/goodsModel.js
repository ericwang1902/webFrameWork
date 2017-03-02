var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var goodsSchema = new Schema({
	'goodsnum' : String,
	'goodsname' : String,
	'goodsdes' : String,
	'goodsphoto' : String,
	'goodsprice' : Number,
	'goodsbuyprice' : Number,
	'goodsstate' : String,
	'goodstype' : String,
	'weight' : String,//权重
	'district': {
		type: Schema.Types.ObjectId,
		ref: 'district'
	},
	'supplier' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'supplier'
	},
	'salesnum' : String,
	'goodsjudge' : Array
});

module.exports = mongoose.model('goods', goodsSchema);
