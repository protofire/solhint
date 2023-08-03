const linter = require('../../../lib/index')
const contractWith = require('../../common/contract-builder').contractWith
const {
  assertErrorCount,
  assertNoErrors,
  assertErrorMessage,
  assertWarnsCount,
} = require('../../common/asserts')
const {
  FUNCTION_CALLS_ERRORS,
  FUNCTION_CALLS_OK,
} = require('../../fixtures/naming/func-named-parameters')

describe('Linter - func-named-parameters', () => {
  for (const key in FUNCTION_CALLS_ERRORS) {
    it(`should raise error for FUNCTION_CALLS_ERRORS [${key}]`, () => {
      const { code, maxUnnamed } = FUNCTION_CALLS_ERRORS[key]

      const sourceCode = contractWith('function callerFunction() public { ' + code + ' }')

      const report = linter.processStr(sourceCode, {
        rules: { 'func-named-parameters': ['error', maxUnnamed] },
      })

      assertErrorCount(report, 1)
      assertErrorMessage(
        report,
        `Missing named parameters. Max unnamed parameters value is ${maxUnnamed}`
      )
    })
  }

  for (const key in FUNCTION_CALLS_OK) {
    it(`should NOT raise error for FUNCTION_CALLS_OK [${key}]`, () => {
      const { code, maxUnnamed } = FUNCTION_CALLS_OK[key]

      const sourceCode = contractWith('function callerFunction() public { ' + code + ' }')

      const report = linter.processStr(sourceCode, {
        rules: { 'func-named-parameters': ['error', maxUnnamed] },
      })

      assertNoErrors(report)
    })
  }

  it('should NOT raise error when default rules are configured', () => {
    const code = contractWith(
      `function callerFunction() public { funcName(sender, amount, receiver); }`
    )
    const report = linter.processStr(code, {
      extends: 'solhint:default',
      rules: {},
    })

    assertNoErrors(report)
  })

  it('should raise error when recommended rules are configured', () => {
    const code = contractWith(
      `function callerFunction() public { funcName(sender, amount, receiver); }`
    )
    const report = linter.processStr(code, {
      extends: 'solhint:recommended',
      rules: { 'compiler-version': 'off' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, `Missing named parameters. Max unnamed parameters value is 2`)
  })

  it('should raise error when rule has no maxUnnamed arguments is set and default value takes over', () => {
    const code = contractWith(
      `function callerFunction() public { funcName(sender, amount, receiver); }`
    )
    const report = linter.processStr(code, {
      rules: { 'func-named-parameters': 'error' },
    })

    assertErrorCount(report, 1)

    // default value is 2 for this rule
    assertErrorMessage(report, `Missing named parameters. Max unnamed parameters value is 2`)
  })
})
