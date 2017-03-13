var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var shoporderSchema = new Schema({
	'ordernum' : String,
	'goodslist' : Array,//ok
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
