var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var supplierSchema = new Schema({
	'suppliernum': String,
	'suppliername': String,
	'supplierdes': String,
	'district': {
		type: Schema.Types.ObjectId,
		ref: 'district'
	},
	'supplieruser': {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	'workers': [{
		type: Schema.Types.ObjectId,
		ref: 'worker'
	}]
});

module.exports = mongoose.model('supplier', supplierSchema);
