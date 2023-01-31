const _ = require('lodash')
const { assertErrorCount, assertNoErrors, assertErrorMessage } = require('../../common/asserts')
const linter = require('../../../lib/index')
const { funcWith } = require('../../common/contract-builder')

describe('Linter - function-max-lines', () => {
  it('should raise error for function with 51 NO EMPTY lines', () => {
    const code = funcWith(noEmptyLines(51))
    const report = linter.processStr(code, {
      rules: { 'function-max-lines': 'error' },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'no more than')
  })

  it('should not raise error for function with 50 NO EMPTY lines', () => {
    const code = funcWith(noEmptyLines(50))

    const report = linter.processStr(code, {
      rules: { 'function-max-lines': 'error' },
    })

    assertNoErrors(report)
  })

  it('should not raise error for function with 99 NO EMPTY lines when 100 lines are allowed', () => {
    const code = funcWith(noEmptyLines(99))

    const report = linter.processStr(code, {
      rules: { 'function-max-lines': ['error', 100] },
    })

    assertNoErrors(report)
  })

  it('should not raise error for function with 11 EMPTY lines when 10 lines are allowed', () => {
    const code = funcWith(emptyLines(11))

    const report = linter.processStr(code, {
      rules: { 'function-max-lines': ['error', 10] },
    })

    assertNoErrors(report)
  })

  it('should not raise error, skipping comments and empty lines', () => {
    const contractCode =
      emptyLines(11) +
      '/*\n this is multiline comment \n this is the second line\n*/ \n' +
      emptyLines(5) +
      'uint256 var1;\n' +
      'uint256 var2;\n' +
      '// single line comment\n'

    const code = funcWith(contractCode)

    const report = linter.processStr(code, {
      rules: { 'function-max-lines': ['error', 3] },
    })

    assertNoErrors(report)
  })

  it('should raise error not considering comments and empty lines but more statements than max-lines ', () => {
    const contractCode =
      emptyLines(11) +
      '/*\n this is multiline comment \n this is the second line\n*/ \n' +
      emptyLines(5) +
      'uint256 var1;\n' +
      'uint256 var2;\n' +
      'uint256 var3;\n' +
      'uint256 var4;\n' +
      '// single line comment \n'

    const code = funcWith(contractCode)

    const report = linter.processStr(code, {
      rules: { 'function-max-lines': ['error', 3] },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'no more than')
  })

  function repeatLines(line, count) {
    return _.times(count)
      .map(() => line)
      .join('\n')
  }

  function emptyLines(count) {
    return repeatLines('', count)
  }

  function noEmptyLines(count) {
    return repeatLines('uint256 variableN;', count)
  }
})
