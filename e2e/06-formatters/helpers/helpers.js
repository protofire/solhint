const foo1Output = [
  {
    line: 2,
    column: 1,
    severity: 'Error',
    message: 'Compiler version >=0.6.0 does not satisfy the ^0.8.0 semver requirement',
    ruleId: 'compiler-version',
    fix: null,
    filePath: 'contracts/Foo.sol',
  },
  {
    line: 5,
    column: 5,
    severity: 'Warning',
    message: 'Constant name must be in capitalized SNAKE_CASE',
    ruleId: 'const-name-snakecase',
    fix: null,
    filePath: 'contracts/Foo.sol',
  },
  {
    line: 6,
    column: 5,
    severity: 'Warning',
    message: 'Explicitly mark visibility of state',
    ruleId: 'state-visibility',
    fix: null,
    filePath: 'contracts/Foo.sol',
  },
  {
    line: 6,
    column: 5,
    severity: 'Warning',
    message: "'TEST2' should start with _",
    ruleId: 'private-vars-leading-underscore',
    filePath: 'contracts/Foo.sol',
  },
  {
    line: 6,
    column: 5,
    severity: 'Warning',
    message: 'Variable name must be in mixedCase',
    ruleId: 'var-name-mixedcase',
    fix: null,
    filePath: 'contracts/Foo.sol',
  },
  {
    line: 8,
    column: 5,
    severity: 'Warning',
    message:
      'Explicitly mark visibility in function (Set ignoreConstructors to true if using solidity >=0.7.0)',
    ruleId: 'func-visibility',
    fix: null,
    filePath: 'contracts/Foo.sol',
  },
  {
    line: 8,
    column: 19,
    severity: 'Warning',
    message: 'Code contains empty blocks',
    ruleId: 'no-empty-blocks',
    fix: null,
    filePath: 'contracts/Foo.sol',
  },
]

const foo2Output = [
  {
    line: 5,
    column: 5,
    severity: 'Warning',
    message: 'Constant name must be in capitalized SNAKE_CASE',
    ruleId: 'const-name-snakecase',
    fix: null,
    filePath: 'contracts/Foo2.sol',
  },
  {
    line: 7,
    column: 5,
    severity: 'Warning',
    message:
      'Explicitly mark visibility in function (Set ignoreConstructors to true if using solidity >=0.7.0)',
    ruleId: 'func-visibility',
    fix: null,
    filePath: 'contracts/Foo2.sol',
  },
  {
    line: 7,
    column: 19,
    severity: 'Warning',
    message: 'Code contains empty blocks',
    ruleId: 'no-empty-blocks',
    fix: null,
    filePath: 'contracts/Foo2.sol',
  },
]

module.exports = { foo1Output, foo2Output }
