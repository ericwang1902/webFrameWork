var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var shoporderSchema = new Schema({
	'ordernum' : String,
	'goodslist' : Array,//ok
	'orderamount':Number,
	'ordertime' : Date,
	'preparetime' : Date,
	'finishtime' : Date,
	'picktime' : Date,
	'receivetime' : Date,
	'district': {
	 	type: Schema.Types.ObjectId,
	 	ref: 'district'
	},
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
