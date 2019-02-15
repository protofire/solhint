const linter = require('./../../../lib/index')
const { funcWith, multiLine } = require('./../../common/contract-builder')
const { assertErrorCount, assertErrorMessage, assertNoErrors } = require('./../../common/asserts')

describe('Linter - code-complexity', () => {
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
    const report = linter.processStr(MAX_COMPLEXITY_EXCEEDED_CODE, {
      rules: { 'code-complexity': 'error' }
    })

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

  it('should not raise error when cyclomatic complexity is equal to max default allowed', () => {
    const report = linter.processStr(MAX_COMPLEXITY_CODE, {
      rules: { 'code-complexity': 'error' }
    })

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
    const report = linter.processStr(CUSTOM_CONFIG_CHECK_CODE, {
      rules: { 'code-complexity': ['error', 12] }
    })

    assertNoErrors(report)
  })
})
