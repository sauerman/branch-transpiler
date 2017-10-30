require('babel-register');
let parser = require('../build');

let tests = [
  {
    source: `
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
`,
    check: `
function calc(method, x, y) {
  let /* branch-transpiler start */ result;

if (true && x > 0 && true) { result = console.error('x must be > 0'); }
 else if (true && true && y > 0) { result = console.error('y must be > 0'); }
 else if (method === 'add' && true && true) { result = x + y; }
 else if (typeof method === 'string' && true && true) { result = x * y; }
 else if (fn(method) && true && true) { result = null; }
/* branch-transpiler end */
}
`
  },
  {
    source: `
branch
  (result) {
  (>= 5   ): console.log("big!")
  (< 5    ): console.log("tiny!")
}
`,
    check: `
/* branch-transpiler start */ ` + `

if (result >= 5) { console.log("big!"); }
 else if (result < 5) { console.log("tiny!"); }
/* branch-transpiler end */
`
  },
  {
    source: `
result = branch
  (cond     , cond[0][0]) {
  (length   , 'typeof'  ): 'typeof ' + variable + ' === ' + condition.replace(/typeof /, '')
  (length   ,           ): variable + ' ' + condition
  (!''      ,           ): variable + ' === ' + condition
  (         ,           ): 'true'
}
`,
    check: `
/* branch-transpiler start */ result;

if (cond === length && cond[0][0] === 'typeof') { result = 'typeof ' + variable + ' === ' + condition.replace(/typeof /, ''); }
 else if (cond === length && true) { result = variable + ' ' + condition; }
 else if (cond === !'' && true) { result = variable + ' === ' + condition; }
 else if (true && true) { result = 'true'; }
/* branch-transpiler end */
`
  }
]

console.log('Running tests...\n');
tests.forEach((test, index) => {
  let result = parser(test.source);
  if (result === test.check) {
    console.log('Test', index, 'passed...');
  } else {
    console.log('#####', test.check.length, result.length);
    console.log('Expected:\n' + JSON.stringify(test.check));
    console.log('Actual:\n' + JSON.stringify(result));
    throw 'Test ' + index + ' failed!';
  }
});