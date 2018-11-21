const { assertErrorMessage, assertNoErrors, assertErrorCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { funcWith, contractWith } = require('./../../common/contract-builder')

describe('Linter - space-after-comma', () => {
  const INCORRECT_COMMA_ALIGN = [
    funcWith('var (a,b) = test1.test2(); a + b;'),
    funcWith('test(1,2, b);'),
    funcWith('test(1,/* test */ 2, b);'),
    contractWith('function b(uint a,uintc) public {}'),
    funcWith('test(1, 2 , b);'),
    funcWith('var (a, ,, b) = test1.test2(); a + b;')
  ]

  INCORRECT_COMMA_ALIGN.forEach(curExpr =>
    it('should raise error when comma incorrect aligned', () => {
      const report = linter.processStr(curExpr, {
        rules: { 'space-after-comma': 'error' }
      })

      assertErrorCount(report, 1)
      assertErrorMessage(report, 'must be separated')
    })
  )

  const CORRECT_COMMA_ALIGN = [
    funcWith('var (a, b,) = test1.test2(); a + b;'),
    funcWith('test(1, 2, b);'),
    contractWith('function b(uint a, uintc) public {}'),
    contractWith('enum A {Test1, Test2}'),
    funcWith('var (a, , , b) = test1.test2(); a + b;')
  ]

  CORRECT_COMMA_ALIGN.forEach(curExpr =>
    it('should raise error when comma incorrect aligned', () => {
      const report = linter.processStr(curExpr, {
        rules: { 'space-after-comma': 'error' }
      })

      assertNoErrors(report)
    })
  )
})
