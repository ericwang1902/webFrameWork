var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var fansSchema = new Schema({

module.exports = mongoose.model('fans', fansSchema);