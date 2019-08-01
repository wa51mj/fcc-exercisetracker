var Exercise = require('../models/exercise');

function createExercise(description, duration, date ) {
  var newExercise = new Exercise({
    description,
    duration,
    date
  });
  return newExercise.save( function(err){
    err ? console.log(`record not saved \n`) : console.log(`record saved \n`)
  });
}
                               
module.exports = createExercise;