const chai = require('chai')
const { expect } = chai
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const shell = require('shelljs')

function useFixture(dir) {
  beforeEach(`switch to ${dir}`, function () {
    const fixturePath = path.join(__dirname, dir)

    const tmpDirContainer = os.tmpdir()
    this.testDirPath = path.join(tmpDirContainer, `solhint-tests-${dir}`)

    fs.ensureDirSync(this.testDirPath)
    fs.emptyDirSync(this.testDirPath)

    fs.copySync(fixturePath, this.testDirPath)

    shell.cd(this.testDirPath)
  })
}

describe('e2e', function () {
  describe('formatter tests', () => {
    // Foo contract has 1 error and 6 warnings
    // Foo2 contract has 3 warnings
    // Foo3 contract has no warnings and no errors
    const { foo1Output, foo2Output } = require('./06-formatters/helpers/helpers.js')
    const PATH = ''

    useFixture('06-formatters')

    it('should fail when wrong formatter is specify', () => {
      const formatterType = 'wrongOne'
      const { code } = shell.exec(`solhint ${PATH}contracts/Foo2.sol -f ${formatterType}`)
      expect(code).to.equal(1)
    })

    describe('unix formatter tests', () => {
      const formatterType = 'unix'

      it('should return nothing when file does not exist and unix is the formatter', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo1.sol -f ${formatterType}`)
        expect(code).to.equal(0)
        expect(stdout.trim()).to.be.empty
      })

      it('should return nothing when file exists and there is no error/warning', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo3.sol -f ${formatterType}`)
        expect(code).to.equal(0)
        expect(stdout.trim()).to.be.empty
      })
      it('should make the output report with unix formatter for Foo2', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo2.sol -f ${formatterType}`)

        const reportLines = stdout.split('\n')
        let expectedLine

        for (let i = 0; i < reportLines.length - 3; i++) {
          expectedLine = `${foo2Output[i].filePath}:${foo2Output[i].line}:${foo2Output[i].column}: ${foo2Output[i].message} [${foo2Output[i].severity}/${foo2Output[i].ruleId}]`
          expect(reportLines[i]).to.equal(expectedLine)
        }
        expect(code).to.equal(0)

        const finalLine = '3 problem/s (3 warning/s)'
        expect(reportLines[reportLines.length - 2]).to.equal(finalLine)
      })
      it('should make the output report with unix formatter for Foo and Foo2 and Foo3', () => {
        const { code, stdout } = shell.exec(
          `solhint ${PATH}contracts/Foo.sol ${PATH}contracts/Foo2.sol ${PATH}contracts/Foo3.sol -f ${formatterType}`
        )

        const reportLines = stdout.split('\n')
        const joinedFoo = foo1Output.concat(foo2Output)
        let expectedLine

        for (let i = 0; i < reportLines.length - 3; i++) {
          expectedLine = `${joinedFoo[i].filePath}:${joinedFoo[i].line}:${joinedFoo[i].column}: ${joinedFoo[i].message} [${joinedFoo[i].severity}/${joinedFoo[i].ruleId}]`
          expect(reportLines[i]).to.equal(expectedLine)
        }
        // because there's an error
        expect(code).to.equal(1)

        const finalLine = '10 problem/s (1 error/s, 9 warning/s)'
        expect(reportLines[reportLines.length - 2]).to.contain(finalLine)
      })
    })

    describe('json formatter tests', () => {
      const formatterType = 'json'

      it('should return nothing when file does not exist and json is the formatter', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo1.sol -f ${formatterType}`)
        expect(code).to.equal(0)
        expect(stdout.trim()).to.be.empty
      })
      it('should return nothing when file exists and there is no error/warning', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo3.sol -f ${formatterType}`)
        expect(code).to.equal(0)
        expect(stdout.trim()).to.be.empty
      })
      it('should make the output report with json formatter for Foo2', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo2.sol -f ${formatterType}`)

        const expectedFinalOutput = foo2Output.concat([{ conclusion: '3 problem/s (3 warning/s)' }])

        // eslint-disable-next-line no-eval
        const objectOutput = eval('(' + stdout + ')')
        const strOutput = JSON.stringify(objectOutput)
        const strExpected = JSON.stringify(expectedFinalOutput)
        expect(strExpected).to.equal(strOutput)
        expect(code).to.equal(0)
      })
      it('should make the output report with unix formatter for Foo and Foo2 and Foo3', () => {
        const { code, stdout } = shell.exec(
          `solhint ${PATH}contracts/Foo.sol ${PATH}contracts/Foo2.sol ${PATH}contracts/Foo3.sol -f ${formatterType}`
        )

        const expectedFinalOutput = foo1Output
          .concat(foo2Output)
          .concat([{ conclusion: '10 problem/s (1 error/s, 9 warning/s)' }])

        // eslint-disable-next-line no-eval
        const objectOutput = eval('(' + stdout + ')')
        const strOutput = JSON.stringify(objectOutput)
        const strExpected = JSON.stringify(expectedFinalOutput)
        expect(strExpected).to.equal(strOutput)
        // There's an error, that is why exit code is 1
        expect(code).to.equal(1)
      })
    })

    describe('compact formatter tests', () => {
      const formatterType = 'compact'

      it('should return nothing when file does not exist and compact is the formatter', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo1.sol -f ${formatterType}`)
        expect(code).to.equal(0)
        expect(stdout.trim()).to.be.empty
      })

      it('should return nothing when file exists and there is no error/warning', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo3.sol -f ${formatterType}`)
        expect(code).to.equal(0)
        expect(stdout.trim()).to.be.empty
      })
      it('should make the output report with compact formatter for Foo2', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo2.sol -f ${formatterType}`)

        const reportLines = stdout.split('\n')
        let expectedLine

        for (let i = 0; i < reportLines.length - 3; i++) {
          expectedLine = `${foo2Output[i].filePath}: line ${foo2Output[i].line}, col ${foo2Output[i].column}, ${foo2Output[i].severity} - ${foo2Output[i].message} (${foo2Output[i].ruleId})`
          expect(reportLines[i]).to.equal(expectedLine)
        }
        expect(code).to.equal(0)

        const finalLine = '3 problem/s (3 warning/s)'
        expect(reportLines[reportLines.length - 2]).to.equal(finalLine)
      })
      it('should make the output report with compact formatter for Foo and Foo2 and Foo3', () => {
        const { code, stdout } = shell.exec(
          `solhint ${PATH}contracts/Foo.sol ${PATH}contracts/Foo2.sol ${PATH}contracts/Foo3.sol -f ${formatterType}`
        )

        const reportLines = stdout.split('\n')
        const joinedFoo = foo1Output.concat(foo2Output)
        let expectedLine

        for (let i = 0; i < reportLines.length - 3; i++) {
          expectedLine = `${joinedFoo[i].filePath}: line ${joinedFoo[i].line}, col ${joinedFoo[i].column}, ${joinedFoo[i].severity} - ${joinedFoo[i].message} (${joinedFoo[i].ruleId})`
          expect(reportLines[i]).to.equal(expectedLine)
        }
        // because there's an error
        expect(code).to.equal(1)

        const finalLine = '10 problem/s (1 error/s, 9 warning/s)'
        expect(reportLines[reportLines.length - 2]).to.contain(finalLine)
      })
    })

    describe('stylish formatter tests', () => {
      const formatterType = 'stylish'

      it('should return nothing when file does not exist and stylish is the formatter', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo1.sol -f ${formatterType}`)
        expect(code).to.equal(0)
        expect(stdout.trim()).to.be.empty
      })

      it('should return nothing when file exists and there is no error/warning', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo3.sol -f ${formatterType}`)
        expect(code).to.equal(0)
        expect(stdout.trim()).to.be.empty
      })
      it('should make the output report with stylish formatter for Foo2', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo2.sol -f ${formatterType}`)

        const reportLines = stdout.split('\n')
        let expectedLine = foo2Output[0].filePath
        expect(reportLines[1]).to.equal(expectedLine)

        for (let i = 2; i < reportLines.length - 4; i++) {
          expectedLine = `  ${foo2Output[i - 2].line}:${foo2Output[i - 2].column}  ${foo2Output[
            i - 2
          ].severity.toLowerCase()}  ${foo2Output[i - 2].message} ${foo2Output[i - 2].ruleId}`

          expect(reportLines[i].replace(/\s/g, '')).to.equal(expectedLine.replace(/\s/g, ''))
        }
        expect(code).to.equal(0)

        const finalLine = '\u2716 3 problems (0 errors, 3 warnings)'
        expect(reportLines[reportLines.length - 3]).to.equal(finalLine)
      })
      it('should make the output report with stylish formatter for Foo and Foo2 and Foo3', () => {
        const { code, stdout } = shell.exec(
          `solhint ${PATH}contracts/Foo.sol ${PATH}contracts/Foo2.sol ${PATH}contracts/Foo3.sol -f ${formatterType}`
        )

        const reportLines = stdout.split('\n')

        let expectedLine
        expectedLine = foo1Output[0].filePath
        expect(reportLines[1]).to.equal(expectedLine)

        expectedLine = foo2Output[0].filePath
        expect(reportLines[10]).to.equal(expectedLine)

        const joinedFoo = foo1Output.concat(foo2Output)
        reportLines.splice(9, 2)
        reportLines.splice(1, 1)

        for (let i = 1; i < reportLines.length - 4; i++) {
          expectedLine = `  ${joinedFoo[i - 1].line}:${joinedFoo[i - 1].column}  ${joinedFoo[
            i - 1
          ].severity.toLowerCase()}  ${joinedFoo[i - 1].message} ${joinedFoo[i - 1].ruleId}`

          expect(reportLines[i].replace(/\s/g, '')).to.equal(expectedLine.replace(/\s/g, ''))
        }
        expect(code).to.equal(1)

        const finalLine = '\u2716 10 problems (1 error, 9 warnings)'
        expect(reportLines[reportLines.length - 3]).to.equal(finalLine)
      })
    })

    describe('tap formatter tests', () => {
      const formatterType = 'tap'

      it('should return TAP header when file does not exist and tap is the formatter', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo1.sol -f ${formatterType}`)

        const reportLines = stdout.split('\n')
        expect(reportLines[0]).to.eq('TAP version 13')
        expect(reportLines[1]).to.eq('1..0')

        expect(code).to.equal(0)
      })

      it('should return TAP header [ok 1] when file exists and there is no error/warning', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo3.sol -f ${formatterType}`)
        const reportLines = stdout.split('\n')
        expect(reportLines[0]).to.eq('TAP version 13')
        expect(reportLines[1]).to.eq('1..1')
        expect(reportLines[2]).to.eq(`ok 1 - ${PATH}contracts/Foo3.sol`)

        expect(code).to.equal(0)
      })
      it('should make the output report with tap formatter for Foo2', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo2.sol -f ${formatterType}`)

        const reportLines = stdout.split('\n')
        expect(reportLines[0]).to.eq('TAP version 13')
        expect(reportLines[1]).to.eq('1..1')
        expect(reportLines[2]).to.eq(`ok 1 - ${foo2Output[0].filePath}`)
        expect(reportLines[4]).to.eq(`  message: ${foo2Output[0].message}`)
        expect(reportLines[5]).to.eq(`  severity: ${foo2Output[0].severity.toLowerCase()}`)
        expect(reportLines[6]).to.eq(`  data:`)
        expect(reportLines[7]).to.eq(`    line: ${foo2Output[0].line}`)
        expect(reportLines[8]).to.eq(`    column: ${foo2Output[0].column}`)
        expect(reportLines[9]).to.eq(`    ruleId: ${foo2Output[0].ruleId}`)

        expect(code).to.equal(0)
      })
    })

    describe('table formatter tests', () => {
      const formatterType = 'table'
      const tableFooter1 =
        '╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗'
      let tableFooter2 = `║ 0 Errors                                                                                                       ║`
      const tableFooter3 =
        '╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢'
      let tableFooter4 = `║ 0 Warnings                                                                                                     ║`
      const tableFooter5 =
        '╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝'
      const tableHeader1 =
        '║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║'
      const tableHeader2 =
        '╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢'

      it('should return TABLE Footer when file does not exist and table is the formatter', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo1.sol -f ${formatterType}`)
        const reportLines = stdout.split('\n')
        expect(reportLines[1]).to.eq(tableFooter1)
        expect(reportLines[2]).to.eq(tableFooter2)
        expect(reportLines[3]).to.eq(tableFooter3)
        expect(reportLines[4]).to.eq(tableFooter4)
        expect(reportLines[5]).to.eq(tableFooter5)

        expect(code).to.equal(0)
      })

      it('should return TABLE Footer when file exists and there is no error/warning', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo3.sol -f ${formatterType}`)
        const reportLines = stdout.split('\n')
        expect(reportLines[1]).to.eq(tableFooter1)
        expect(reportLines[2]).to.eq(tableFooter2)
        expect(reportLines[3]).to.eq(tableFooter3)
        expect(reportLines[4]).to.eq(tableFooter4)
        expect(reportLines[5]).to.eq(tableFooter5)

        expect(code).to.equal(0)
      })
      it('should make the output report with table formatter for Foo', () => {
        const { code, stdout } = shell.exec(`solhint ${PATH}contracts/Foo.sol -f ${formatterType}`)
        const reportLines = stdout.split('\n')

        expect(reportLines[1]).to.eq(foo1Output[0].filePath)

        tableFooter2 = tableFooter2.replace('0 Errors', '1 Error ')
        tableFooter4 = tableFooter4.replace('0', '6')
        expect(reportLines[17]).to.eq(tableFooter1)
        expect(reportLines[18]).to.eq(tableFooter2)
        expect(reportLines[19]).to.eq(tableFooter3)
        expect(reportLines[20]).to.eq(tableFooter4)
        expect(reportLines[21]).to.eq(tableFooter5)

        expect(reportLines[3]).to.eq(tableHeader1)
        expect(reportLines[4]).to.eq(tableHeader2)

        expect(code).to.equal(1)
      })
    })
  })
})
