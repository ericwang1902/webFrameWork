var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ficorderSchema = new Schema({

module.exports = mongoose.model('ficorder', ficorderSchema);