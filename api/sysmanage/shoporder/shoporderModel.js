var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var shoporderSchema = new Schema({
	'ordernum' : String,
	'goodslist' : Array,//ok
	'status':String,//商铺订单的状态
	'ordertime' : Date,
	'preparetime' : Date,
	'finishtime' : Date,
	'picktime' : Date,
	'receivetime' : Date,
	'ficorder' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'ficorder'
	},
	'supplier' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'supplier'
	}//ok
});

module.exports = mongoose.model('shoporder', shoporderSchema);
