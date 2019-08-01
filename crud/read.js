var mongoose = require('mongoose');
var Users = require('../models/user');

function readUserName (userName){
  return Users.findOne({userName: userName}, function(err, record){
    record ? console.log(`record found`) : console.log(`record not found`)
    return record;
  });
}

function readId (id){
  let validId = mongoose.Types.ObjectId.isValid(id)
  if(!validId) {
    console.log('invalid id')
    return false;
  }
  return Users.findById(id, function(err, record){
    record ? console.log(`record found`) : console.log(`record not found`);
    if(err) return false;
    return record;
  });
}

function readUsers() {
  return Users.find({}).select('_id userName');
}

module.exports = {readUserName, readId, readUsers};