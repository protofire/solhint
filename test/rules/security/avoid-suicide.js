const assert = require('assert')
const linter = require('../../../lib/index')
const funcWith = require('../../common/contract-builder').funcWith
const contractWith = require('../../common/contract-builder').contractWith

describe('Linter - avoid-suicide', () => {
  const DEPRECATION_ERRORS = ['suicide();']

  DEPRECATION_ERRORS.forEach((curText) =>
    it(`should return error that used deprecations ${curText}`, () => {
      const code = funcWith(curText)

      const report = linter.processStr(code, {
        rules: { 'avoid-suicide': 'error' },
      })

      assert.equal(report.errorCount, 1)
      assert.ok(report.reports[0].message.includes('deprecate'))
    })
  )

  const ALMOST_DEPRECATION_ERRORS = ['suicides();', 'selfdestruct();']

  ALMOST_DEPRECATION_ERRORS.forEach((curText) =>
    it(`should not return error when doing ${curText}`, () => {
      const code = funcWith(curText)

      const report = linter.processStr(code, {
        rules: { 'avoid-suicide': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })
  )

  it(`should not return error when doing for struct name suicide`, () => {
    const code = contractWith('struct AnotherNiceStruct { uint256 suicide; uint256 c; }')

    const report = linter.processStr(code, {
      rules: { 'avoid-suicide': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })
})
