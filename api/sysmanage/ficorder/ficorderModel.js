var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ficorderSchema = new Schema({
	'ficordernum' : String,
	'ficorderstate' : String,
	'region':{
	 	type: Schema.Types.ObjectId,
	 	ref: 'region'
	}
});

module.exports = mongoose.model('ficorder', ficorderSchema);
