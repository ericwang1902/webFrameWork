var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var regionSchema = new Schema({
	'regionname' : String,
	'district' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'district'
	}
});

module.exports = mongoose.model('region', regionSchema);
