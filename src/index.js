const regex = {
  main: /((\S*)[\s]*?=[\s]*?)?branch[\s]*?\(([\s\S]*?),*\)[\s]*?{([\s\S]*?)}/g,
  body: /\(([\s\S]*?)[:{]([\s\S]*?)\n/g,
  operators: /(<=|<|>=|>|typeof|\(\))/g,
};

function match(input, regex) {
  let result = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    result.push(match);
  }
  
  return result;  
}

function findBranches(input) {
  return match(input, regex.main);
} 

function parseCaseArguments(input) {
  let result = input.trim();
  result = result.substr(0, result.length - 1);
  return result.split(',').map(item => item.trim());
}

function parseBranch(branch) {
  let cases = match(branch[4], regex.body);
  cases = cases.map(item => {
    return {
      conditions: parseCaseArguments(item[1]),
      body: item[2].trim(),
    };
  });

  return {
    original: branch[0],
    target: branch[2],
    variables: branch[3].split(',').map(item => item.trim()),
    cases,
  };
}

function transformBranch(branch) {
  branch.transformation = 
    '/* branch-transpiler start */ ' + 
    (branch.target ? branch.target + ';' : '') +
    '\n\n' + 
    transformCases(branch) + 
    '/* branch-transpiler end */'
  ;
  return branch;
}

function transformCases(branch) {
  return branch.cases.reduce(
    (left, right, index) => {
      return left + right.conditions.reduce(
          (left, right, index) => {
            return left + 
              (left !== '' ? ' && ' : '') +
              (right !== '' ? handleCondition(branch.variables[index], right) : 'true');
          },
          ''
        ) +
        ') { ' +
        (branch.target ? branch.target + ' = ' : '') +
        right.body + '; }\n' +
        (branch.cases.length - 1 !== index ? ' else if (' : '')
      ;
    },
    'if ('
  );
}

function handleCondition(variable, condition) {
  let result;
  let cond = match(
    condition.replace(/'[\S\s]*?'/g, ''),
    regex.operators
  );

  if (cond.length) {
    let operator = cond[0][0];
    if (operator === 'typeof') {
      result = 'typeof ' + variable + ' === ' + condition.replace(/typeof /, '');
    } else if (operator === '()') {
      result = condition.replace('()', '(' + variable + ')');
    } else {
      result = variable + ' ' + condition;
    }
  } else if (condition !== '') {
    result = variable + ' === ' + condition;
  } else {
    result = 'true';
  }
  
  return result;
}

module.exports = function parser(input) {
  //if used in gulp
  let buffer = false;
  if (typeof input.isBuffer === 'function' && input.isBuffer()) {
   	buffer = input;
    input = input.contents.toString();
  }	

  //if used as webpack-loader
  if (this && typeof this.cacheable === 'function') {
    this.cacheable();
  }
  
  let data = findBranches(input)
    .map(branch => parseBranch(branch))
    .map(branch => transformBranch(branch))
    .reduce(
      (result, branch) => result.replace(
        branch.original, branch.transformation
      ),
      input
    )
  ;

  if (buffer) {
  	buffer.contents = new Buffer(data);
  	return buffer;
  } else {
  	return data;
  }
};