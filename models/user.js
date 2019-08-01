var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var exerciseSchema = require('./exercise')

var userSchema = {
  userName: String,
  count: Number,
  log: [exerciseSchema]
};

var model = mongoose.model('users', userSchema);

module.exports = model;