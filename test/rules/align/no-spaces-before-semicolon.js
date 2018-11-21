const { assertErrorMessage, assertNoErrors, assertErrorCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { funcWith } = require('./../../common/contract-builder')

describe('Linter - no-spaces-before-semicolon', () => {
  const INCORRECT_SEMICOLON_ALIGN = [
    funcWith('var (a, b) = test1.test2() ; a + b;'),
    funcWith('test(1, 2, b) ;'),
    funcWith('test(1, 2, b)/* test */;'),
    funcWith('for ( ;;) {}'),
    funcWith('for (i = 0; ;) {}'),
    funcWith('for ( ; a < b;) {}')
  ]

  INCORRECT_SEMICOLON_ALIGN.forEach(curExpr =>
    it('should raise error when semicolon incorrect aligned', () => {
      const report = linter.processStr(curExpr, {
        rules: { 'no-spaces-before-semicolon': 'error' }
      })

      assertErrorCount(report, 1)
      assertErrorMessage(report, 'Semicolon must not have spaces before')
    })
  )

  const CORRECT_SEMICOLON_ALIGN = [
    funcWith('var (a, b,) = test1.test2(); a + b;'),
    funcWith('test(1, 2, b);')
  ]

  CORRECT_SEMICOLON_ALIGN.forEach(curExpr =>
    it('should raise error when semicolon incorrect aligned', () => {
      const report = linter.processStr(curExpr, {
        rules: { 'no-spaces-before-semicolon': 'error' }
      })

      assertNoErrors(report)
    })
  )
})
