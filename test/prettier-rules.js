const assert = require('assert')
const linter = require('./../lib/index')
const { contractWithPrettier } = require('./common/contract-builder')
const { prettier } = require('./common/configs')
const { storeAsFile, removeTmpFiles } = require('./common/utils')
const { assertNoErrors, assertErrorCount } = require('./common/asserts')

describe('Linter', () => {
  describe('Prettier Rules', () => {
    after(() => {
      removeTmpFiles()
    })

    it('should raise prettier errors', () => {
      const filePath = storeAsFile(`pragma solidity ^0.4.0;

contract shapeCalculator {
    string constant text = 'abc';
    function rectangle(uint w, uint h) returns (uint s, uint p) {
s = w * h; p = 2 * (w + h);
    }
}`)
      const report = linter.processFile(filePath, prettier())

      assertErrorCount(report, 5)
      assert.equal(report.filePath, filePath)
      assert.ok(
        report.messages[0].message.includes(
          'Replace ··string·constant·text·=·\'abc\' with string·constant·text·=·"abc"'
        )
      )
      assert.ok(
        report.messages[1].message.includes(
          'Replace ····function·rectangle(uint·w,·uint·h)·returns· with ··function·rectangle(uint·w,·uint·h)·returns'
        )
      )
      assert.ok(report.messages[2].message.includes('Replace s·=·w·*·h; with ····s·=·w·*·h;⏎···'))
      assert.ok(report.messages[3].message.includes('Delete ··'))
      assert.ok(report.messages[4].message.includes('Insert ⏎'))
    })

    it('should not raise prettier errors', () => {
      const filePath = storeAsFile(contractWithPrettier('uint private a;'))

      const report = linter.processFile(filePath, prettier())

      assertNoErrors(report)
      assert.equal(report.filePath, filePath)
    })
  })
})
