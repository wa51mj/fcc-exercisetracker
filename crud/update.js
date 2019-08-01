var Users = require('../models/user');


function addExercise (id, obj){
  
  return Users.findOne({_id: id}, function(err, user){
    console.log(obj);
    console.log(user);
    user.log.push(obj);
    user.save();
  });
}

module.exports = addExercise;