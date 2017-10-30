# branch-transpiler
Can also be used as `gulp`-Plugin or `webpack-loader`.
## Usage

```
function calc(method, x, y) {
  let result = branch
    (method,   x,   y) {
    (      , > 0,    ): throw 'x must be > 0'
    (      ,    , > 0): throw 'y must be > 0'
    ('add' ,    ,    ): x + y
    ('sub' ,    ,    ): x - y
    ('mul' ,    ,    ): x * y
  }

  return result;
}
```

## Possible "operators"
* `` - "nothing" is always `true`
* `<=`
* `<`
* `>`
* `>=`
* `typeof`
* `()` - function -> gets the variable to check against as input