var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var orderSchema = new Schema({
	'ordernum' : String,
	'suitelist' : Array,
	'goodslist' : Array,
	'totalamount' : Number,
	'coupon' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'coupon'
	},
	'paytype' : String,
	'paystate' : String,
	'ordertime' : Date,
	'preparetime' : Date,
	'finishtime' : Date,
	'picktime' : Date,
	'receivetime' : Date,
	'paytime' : Date,
	'fanid' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'fans'
	},
	'address' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'address'
	},
	'note' : String,
	'ficorder' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'ficorder'
	}
});

module.exports = mongoose.model('order', orderSchema);
