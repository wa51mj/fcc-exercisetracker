function queryLog(user, userId, options){
  console.log('\n query log')
  let {from, to, limit} = validateOptions(options);
  console.log({from, to, limit});
  
  let results = [];
  user.log.forEach( (exercise, i) => {
    let fromValid = exercise.date >= from;
    let toValid = exercise.date <= to;
    let withinPeriod = fromValid && toValid;
    let lessThanLimit = results.length <= limit;
    
    if(withinPeriod && lessThanLimit) {
      results.push(exercise);
    }
  })
  return results;
  
}

function validateOptions(options){
  console.log('validating options')
  let {from, to, limit} = options;
    
  let pattern = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/ // yyyy-mm-dd https://www.regextester.com/96683
  from = pattern.test(from) ? new Date(from) : new Date(1900, 1, 1)
  to = pattern.test(to) ? new Date(to) : new Date();
  limit = parseInt(limit) ? parseInt(limit) : Infinity;
  
  return {from, to, limit};
}

module.exports = queryLog;

/*
find({ occupation: /host/ }).
  where('name.last').equals('Ghost').
  where('age').gt(17).lt(66).
  where('likes').in(['vaporizing', 'talking']).
  limit(10).
*/