var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exerciseSchema = {
  //userId: { type: Schema.Types.ObjectId, ref: 'users' },
  description: String,
  duration: Number,
  date: Date
};

//var model = mongoose.model('exercises', exerciseSchema); not mapping to database will instead use sub-doc method

module.exports = exerciseSchema;