var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var shoporderSchema = new Schema({	'ordernum' : String,	'goodslist' : Array,	'ordertime' : Date,	'preparetime' : Date,	'finishtime' : Date,	'picktime' : Date,	'receivetime' : Date,	'ficorder' : {	 	type: Schema.Types.ObjectId,	 	ref: 'ficorder'	},	'supplierid' : {	 	type: Schema.Types.ObjectId,	 	ref: 'supplier'	}});

module.exports = mongoose.model('shoporder', shoporderSchema);
