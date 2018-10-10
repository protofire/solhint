const assert = require('assert')
const linter = require('./../lib/index')
const { assertNoErrors, assertErrorCount } = require('./common/asserts')
const { contractWith } = require('./common/contract-builder')
const { noIndent } = require('./common/configs')
const { storeAsFile, removeTmpFiles } = require('./common/utils')

describe('Linter', () => {
  describe('File Linting', () => {
    it('should raise no error', () => {
      const filePath = storeAsFile(contractWith('string private a = "test";'))

      const report = linter.processFile(filePath, noIndent())

      assertNoErrors(report)
      assert.equal(report.filePath, filePath)
    })

    it('should raise an one error', () => {
      const filePath = storeAsFile(contractWith("string private a = 'test';"))

      const reports = linter.processPath(filePath, noIndent())

      assertErrorCount(reports[0], 1)
    })

    after(() => {
      removeTmpFiles()
    })
  })
})
