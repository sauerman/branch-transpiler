/* global branch */
const regex = {};
function match(){}

function handleCondition(variable, condition) {
  let result;
  let cond = match(condition, regex.operators);

  result = branch
    (cond     , cond[0][0]) {
    (length   , 'typeof'  ): 'typeof ' + variable + ' === ' + condition.replace(/typeof /, '')
    (length   ,           ): variable + ' ' + condition
    (!''      ,           ): variable + ' === ' + condition
    (         ,           ): 'true'
  }
  
  return result;
}