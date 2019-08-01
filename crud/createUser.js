var User = require('../models/user');

function createUser(name) {
  var newUser = new User({userName: name});
  return newUser.save( function(err){
    err ? console.log(`record not saved \n`) : console.log(`record saved \n`)
  });
}
                               
module.exports = createUser;