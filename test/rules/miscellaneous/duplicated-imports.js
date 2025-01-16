const assert = require('assert')
const linter = require('../../../lib/index')
const { assertNoErrors, assertErrorCount } = require('../../common/asserts')
const TEST_CASES = require('../../fixtures/miscellaneous/duplicated-imports-data')

describe('Linter - duplicated-imports', () => {
  for (const importCase of TEST_CASES.duplicates) {
    it(`Should report ${importCase.qtyDuplicates} error/s for ${importCase.name}`, () => {
      const code = importCase.code

      const report = linter.processStr(code, {
        rules: { 'duplicated-imports': 'error' },
      })

      // assert.equal(report.errorCount, )
      assertErrorCount(report, importCase.qtyDuplicates)

      for (let i = 0; i < report.reports.length; i++) {
        assert.ok(report.reports[i].message.includes(importCase.message[i]))
      }
    })
  }

  for (const importCase of TEST_CASES.noDuplicates) {
    it(`Should NOT report errors for ${importCase.name}`, () => {
      const code = importCase.code

      const report = linter.processStr(code, {
        rules: { 'duplicated-imports': 'error' },
      })

      assertNoErrors(report)
    })
  }
})
