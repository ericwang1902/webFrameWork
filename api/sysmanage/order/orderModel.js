var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var orderSchema = new Schema({
	'ordernum' : String,
	'suitelist' : Array,//cart
	'goodslist' : Array, //cart
	'totalamount' : Number,//cart
	'taotalcount':Number,//cart
	'coupon' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'coupon'
	},
	'paytype' : String,//wechat
	'paystate' : String,//1
	'ordertime' : Date,//post time
	'preparetime' : Date,
	'finishtime' : Date,
	'picktime' : Date,
	'receivetime' : Date,
	'paytime' : Date,//=ordertime
	'fanid' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'fans'
	},//query fansid
	'district':{
	 	type: Schema.Types.ObjectId,
	 	ref: 'district'
	},//
	'region':{
	 	type: Schema.Types.ObjectId,
	 	ref: 'region'
	},//
	'address' : String,//
	'note' : String,
	'ficorder' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'ficorder'
	}//后面管理员点击生成的时候进行关联
});

module.exports = mongoose.model('order', orderSchema);
