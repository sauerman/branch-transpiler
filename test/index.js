import parser from '../build/index.js';

let input = ` 
  function calc(method, x, y) {
    let result = branch
      (method,   x,   y) {
      (      , > 0,    ): console.error('x must be > 0')
      (      ,    , > 0): console.error('y must be > 0')
      ('add' ,    ,    ): x + y
      (typeof 'string' ,    ,    ): x * y
      (fn()  ,    ,    ): null
    }
  }
  
  let result = calc('add', 1, 1);
  
  branch
    (result) {
    (>= 5   ): console.log("big!")
    (< 5    ): console.log("tiny!")
  }
  
  result = branch
    (cond     , cond[0][0]) {
    (length   , 'typeof'  ): 'typeof ' + variable + ' === ' + condition.replace(/typeof /, '')
    (length   ,           ): variable + ' ' + condition
    (!''      ,           ): variable + ' === ' + condition
    (         ,           ): 'true'
  }
  
`;

let result = parser(input);
console.log('result\n\n', result);
