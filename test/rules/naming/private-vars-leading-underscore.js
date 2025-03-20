const assert = require('assert')
const linter = require('../../../lib/index')
const { contractWith, libraryWith } = require('../../common/contract-builder')

describe('Linter - private-vars-leading-underscore', () => {
  const SHOULD_WARN_CASES = [
    // warn when private/internal/default names don't start with _
    contractWith('uint foo;'),
    contractWith('uint private foo;'),
    contractWith('uint internal foo;'),
    contractWith('function foo() {}'),
    contractWith('function foo() private {}'),
    contractWith('function foo() internal {}'),

    // warn when public/external names start with _
    contractWith('uint public _foo;'),
    contractWith('uint external _foo;'),
    contractWith('function _foo() public {}'),
    contractWith('function _foo() external {}'),
  ]

  const SHOULD_WARN_STRICT_CASES = [
    contractWith('function _foo() internal { uint _bar; }'),
    contractWith('function foo(uint _bar) external {}'),
    contractWith('function foo() public returns (uint256 _bar) {}'),
  ]

  const SHOULD_NOT_WARN_CASES = [
    // don't warn when private/internal/default names start with _
    contractWith('uint _foo;'),
    contractWith('uint private _foo;'),
    contractWith('uint internal _foo;'),
    contractWith('function _foo() {}'),
    contractWith('function _foo() private {}'),
    contractWith('function _foo() internal {}'),
    libraryWith('function _foo() {}'),
    libraryWith('function _foo() internal {}'),
    libraryWith('function _foo() private {}'),

    // don't warn when public/external names don't start with _
    contractWith('uint public foo;'),
    contractWith('uint public foo = 2;'),
    contractWith('function foo() public {}'),
    contractWith('function foo() external {}'),
    libraryWith('function foo() public {}'),
    libraryWith('function foo() external {}'),

    // don't warn for constructors
    contractWith('constructor() public {}'),

    // other names (variables, parameters, returns) shouldn't be affected by this rule
    contractWith('function foo(uint bar) external {}'),
    contractWith('function foo() public { uint bar; }'),
    contractWith('function _foo() returns (uint256) {}'),
    contractWith('function _foo() returns (uint256 bar) {}'),
    libraryWith('function foo(uint bar) external {}'),
    libraryWith('function foo() public { uint bar; }'),
    libraryWith('function _foo() returns (uint256) {}'),
    libraryWith('function _foo() internal returns (uint256 bar) {}'),
  ]

  SHOULD_WARN_CASES.forEach((code, index) => {
    it(`should emit a warning (${index})`, () => {
      const report = linter.processStr(code, {
        rules: { 'private-vars-leading-underscore': 'error' },
      })

      assert.equal(report.errorCount, 1)
    })
  })

  SHOULD_WARN_STRICT_CASES.concat(SHOULD_NOT_WARN_CASES).forEach((code, index) => {
    it(`should not emit a warning (not strict) (${index})`, () => {
      const report = linter.processStr(code, {
        rules: { 'private-vars-leading-underscore': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })
  })

  SHOULD_NOT_WARN_CASES.forEach((code, index) => {
    it(`should not emit a warning (${index})`, () => {
      const report = linter.processStr(code, {
        rules: { 'private-vars-leading-underscore': ['error', { strict: true }] },
      })

      assert.equal(report.errorCount, 0)
    })
  })

  SHOULD_WARN_STRICT_CASES.forEach((code, index) => {
    it(`should emit a warning (strict) (${index})`, () => {
      const report = linter.processStr(code, {
        rules: { 'private-vars-leading-underscore': ['error', { strict: true }] },
      })

      assert.equal(report.errorCount, 1)
    })
  })
})
