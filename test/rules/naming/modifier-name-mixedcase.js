const assert = require('assert')
const linter = require('../../../lib/index')
const contractWith = require('../../common/contract-builder').contractWith

describe('Linter - modifier-name-mixedcase', () => {
  it('should raise modifier name error', () => {
    const code = contractWith('modifier owned_by(address a) { }')

    const report = linter.processStr(code, {
      rules: { 'modifier-name-mixedcase': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('mixedCase'))
  })

  it('should not raise modifier name error', () => {
    const code = contractWith('modifier ownedBy(address a) { }')

    const report = linter.processStr(code, {
      rules: { 'modifier-name-mixedcase': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  describe('with $ character', () => {
    const WITH_$ = {
      $: contractWith('modifier $(address a) { }'),
      'starting with $': contractWith('modifier $ownedBy(address a) { }'),
      'containing a $': contractWith('modifier owned$By(address a) { }'),
      'ending with $': contractWith('modifier ownedBy$(address a) { }'),
    }

    for (const [key, code] of Object.entries(WITH_$)) {
      it(`should not raise func name error for functions ${key}`, () => {
        const report = linter.processStr(code, {
          rules: { 'modifier-name-mixedcase': 'error' },
        })

        assert.equal(report.errorCount, 0)
      })
    }
  })
})
