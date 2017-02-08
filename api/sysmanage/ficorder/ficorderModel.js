var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ficorderSchema = new Schema({	'ficordernum' : String,	'ficorderstate' : String});

module.exports = mongoose.model('ficorder', ficorderSchema);
