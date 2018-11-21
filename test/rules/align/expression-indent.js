const assert = require('assert')
const linter = require('./../../../lib/index')
const { funcWith } = require('./../../common/contract-builder')
const { assertNoErrors } = require('./../../common/asserts')

describe('Linter - expression-indent', () => {
  describe('Incorrect expression-indent', () => {
    const INCORRECT_EXPRESSIONS = [
      'new  TrustedContract',
      'myArray[ 5 ]',
      'myArray/* test */[5]',
      'myFunc( 1, 2, 3 )',
      'myFunc. call(1)',
      'a = ( b + c )',
      'a=b + 1',
      'a+=1',
      'a ==b',
      '1** 2',
      'a &&b',
      'a > b ?a : b',
      '! a',
      'a ++',
      'a +=1'
    ]

    INCORRECT_EXPRESSIONS.forEach(curExpr =>
      it(`should raise expression indentation error for ${curExpr}`, () => {
        const code = funcWith(curExpr + ';')

        const report = linter.processStr(code, {
          rules: { 'expression-indent': 'error' }
        })

        assert.equal(report.errorCount, 1)
        assert.ok(report.messages[0].message.includes('Expression indentation is incorrect'))
      })
    )
  })

  describe('Correct expression-indent', () => {
    const CORRECT_EXPRESSIONS = [
      'new TrustedContract',
      'myArray[5]',
      'myFunc(1, 2, 3)',
      'emit myEvent(1, 2, 3)',
      'myFunc.call(1)',
      'a = (b + c)',
      'a = b + 1',
      'a += 1',
      'a == b',
      '1**2',
      'a && b',
      'a > b ? a : b',
      '!a',
      'a++',
      'a += 1',
      'a += (b + c) * d',
      'bytesStringTrimmed[j] = bytesString[j]'
    ]

    CORRECT_EXPRESSIONS.forEach(curExpr =>
      it(`should not raise expression indentation error for ${curExpr}`, () => {
        const code = funcWith(curExpr + ';')

        const report = linter.processStr(code, {
          rules: { 'expression-indent': 'error' }
        })

        assertNoErrors(report, 0)
      })
    )
  })
})
