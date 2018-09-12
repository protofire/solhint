const _ = require('lodash')
const linter = require('./../lib/index')
const { funcWith } = require('./common/contract-builder')
const { noIndent } = require('./common/configs')
const { assertErrorCount, assertErrorMessage, assertNoErrors } = require('./common/asserts')
const { multiLine } = require('./common/contract-builder')

describe('Linter - Code Complexity Rule', () => {
  const MAX_COMPLEXITY_EXCEEDED_CODE = funcWith(
    multiLine(
      ' if (a > b) {                   ',
      '   if (b > c) {                 ',
      '     if (c > d) {               ',
      '       if (d > e) {             ',
      '       } else {                 ',
      '       }                        ',
      '     }                          ',
      '   }                            ',
      ' }                              ',
      'for (i = 0; i < b; i += 1) { }  ',
      'do { d++; } while (b > c);       ',
      'while (d > e) { }               '
    )
  )

  it('should raise error when cyclomatic complexity of code is too high', () => {
    const report = linter.processStr(MAX_COMPLEXITY_EXCEEDED_CODE, noIndent())

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'complexity')
  })

  const MAX_COMPLEXITY_CODE = funcWith(
    multiLine(
      ' if (a > b) {                   ',
      '   if (b > c) {                 ',
      '     if (c > d) {               ',
      '     }                          ',
      '   }                            ',
      ' }                              ',
      'for (i = 0; i < b; i += 1) { }  ',
      'do { d++; } while (b > c);       ',
      'while (d > e) { }               '
    )
  )

  it('should not raise error when cyclomatic complexity is equal to max allowed', () => {
    const report = linter.processStr(MAX_COMPLEXITY_CODE, noIndent())

    assertNoErrors(report)
  })

  const CUSTOM_CONFIG_CHECK_CODE = funcWith(
    multiLine(
      ' if (a > b) {                   ',
      '   if (b > c) {                 ',
      '     if (c > d) {               ',
      '     }                          ',
      '   }                            ',
      ' }                              ',
      'for (i = 0; i < b; i += 1) { }  ',
      'do { d++; } while (b > c);       ',
      'while (d > e) { }               ',
      'while (d > e) { }               ',
      'while (d > e) { }               ',
      'while (d > e) { }               '
    )
  )

  it('should not raise error when cyclomatic complexity is equal to max allowed', () => {
    const config = _.defaultsDeep(noIndent(), { rules: { 'code-complexity': ['error', 12] } })

    const report = linter.processStr(CUSTOM_CONFIG_CHECK_CODE, config)

    assertNoErrors(report)
  })
})
