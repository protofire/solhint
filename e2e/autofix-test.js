const chai = require('chai')
const { expect } = chai
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const shell = require('shelljs')
const spawnSync = require('spawn-sync')

const E2E = true

let params
let currentConfig
let currentFile
let beforeFixFile
let afterFixFile

function retrieveParams(subpath) {
  if (E2E) {
    return { command: 'solhint', param1: '', path: '', subpath }
  } else {
    return { command: 'node', param1: 'solhint', path: 'e2e/08-autofix/', subpath }
  }
}

function compareTextFiles(file1Path, file2Path) {
  const file1Content = fs.readFileSync(file1Path, 'utf-8')
  const file2Content = fs.readFileSync(file2Path, 'utf-8')
  return file1Content === file2Content
}

function copyFile(sourcePath, destinationPath) {
  shell.cp(sourcePath, destinationPath)
}

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
  let result = false
  let code
  let stdout

  describe('autofix tests', () => {
    if (E2E) {
      useFixture('08-autofix')
    }

    describe('autofix command line options', () => {
      before(function () {
        params = retrieveParams('commands/')
        currentConfig = `${params.path}${params.subpath}.solhint.json`
        currentFile = `${params.path}${params.subpath}Foo1.sol`
        beforeFixFile = `${params.path}${params.subpath}Foo1BeforeFix.sol`
        afterFixFile = `${params.path}${params.subpath}Foo1AfterFix.sol`
      })

      describe('--fix without noPrompt', () => {
        after(function () {
          if (!E2E) {
            copyFile(beforeFixFile, currentFile)
          }
        })

        it('should terminate with --fix and user choose NOT to continue', () => {
          const solhintProcess = spawnSync(
            `${params.command}`,
            [`${params.param1}`, '-c', currentConfig, currentFile, '--fix', '--disc'],
            {
              input: 'n\n', // Provide 'n' as input
              shell: true,
            }
          )

          expect(solhintProcess.status).to.equal(0)
          expect(solhintProcess.stdout.toString().includes('Process terminated by user'))
        })

        it('should compare Foo1 file with template beforeFix file and they should match 1a', () => {
          result = compareTextFiles(currentFile, beforeFixFile)
          expect(result).to.be.true
        })

        it('should fix with --fix and user choose YES to continue', () => {
          const solhintProcess = spawnSync(
            `${params.command}`,
            [`${params.param1}`, '-c', currentConfig, currentFile, '--fix', '--disc'],
            {
              input: 'y\n', // Provide 'y' as input
              shell: true,
            }
          )

          expect(solhintProcess.status).to.equal(1)
          expect(solhintProcess.stdout.toString().includes('5 problems (5 errors, 0 warnings)'))
        })
      })
      it('should check FOO1 does not change after test 1a', () => {
        result = compareTextFiles(currentFile, beforeFixFile)
        expect(result).to.be.true
      })

      describe('--fix with noPrompt', () => {
        after(function () {
          if (!E2E) {
            copyFile(beforeFixFile, currentFile)
          }
        })

        it('should compare Foo1 file with template beforeFix file and they should match 1b', () => {
          result = compareTextFiles(currentFile, beforeFixFile)
          expect(result).to.be.true
        })

        it('should fix file when noPrompt 1b', () => {
          const { code, stdout } = shell.exec(
            `${params.command} ${params.param1} -c ${currentConfig} ${currentFile} --fix --disc --noPrompt`
          )

          expect(code).to.equal(1)

          const reportLines = stdout.split('\n')
          const finalLine = '5 problems (5 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)

          result = compareTextFiles(currentFile, afterFixFile)
          expect(result).to.be.true
        })
      })

      it('should check FOO1 does not change after test 1b', () => {
        result = compareTextFiles(currentFile, beforeFixFile)
        expect(result).to.be.true
      })
    })

    describe('autofix rule: explicit-types', () => {
      before(function () {
        params = retrieveParams('explicit-types/')
        currentConfig = `${params.path}${params.subpath}.solhint.json`
        currentFile = `${params.path}${params.subpath}Foo1.sol`
        beforeFixFile = `${params.path}${params.subpath}Foo1BeforeFix.sol`
        afterFixFile = `${params.path}${params.subpath}Foo1AfterFix.sol`
      })
      describe('--fix with noPrompt', () => {
        after(function () {
          if (!E2E) {
            copyFile(beforeFixFile, currentFile)
          }
        })

        it('should compare Foo1 file with template BEFORE FIX file and they should match (2)', () => {
          result = compareTextFiles(currentFile, beforeFixFile)
          expect(result).to.be.true
        })

        it('should execute and compare Foo1 with template AFTER FIX and they should match (2)', () => {
          ({ code, stdout } = shell.exec(
            `${params.command} ${params.param1} -c ${currentConfig} ${currentFile} --fix --disc --noPrompt`
          ))

          result = compareTextFiles(currentFile, afterFixFile)
          expect(result).to.be.true
        })

        it('should execute and exit with code 1 (2)', () => {
          expect(code).to.equal(1)
        })

        it('should get the right report (2)', () => {
          const reportLines = stdout.split('\n')
          const finalLine = '5 problems (5 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })
      })

      it('should check FOO1 does not change after test (2)', () => {
        result = compareTextFiles(currentFile, beforeFixFile)
        expect(result).to.be.true
      })
    })

    describe('autofix rule: no-console', () => {
      before(function () {
        params = retrieveParams('no-console/')
        currentConfig = `${params.path}${params.subpath}.solhint.json`
        currentFile = `${params.path}${params.subpath}Foo1.sol`
        beforeFixFile = `${params.path}${params.subpath}Foo1BeforeFix.sol`
        afterFixFile = `${params.path}${params.subpath}Foo1AfterFix.sol`
      })
      describe('--fix with noPrompt', () => {
        after(function () {
          if (!E2E) {
            copyFile(beforeFixFile, currentFile)
          }
        })

        it('should compare Foo1 file with template BEFORE FIX file and they should match (3)', () => {
          result = compareTextFiles(currentFile, beforeFixFile)
          expect(result).to.be.true
        })

        it('should execute and compare Foo1 with template AFTER FIX and they should match (3)', () => {
          ({ code, stdout } = shell.exec(
            `${params.command} ${params.param1} -c ${currentConfig} ${currentFile} --fix --disc --noPrompt`
          ))

          result = compareTextFiles(currentFile, afterFixFile)
          expect(result).to.be.true
        })

        it('should execute and exit with code 1 (3)', () => {
          expect(code).to.equal(1)
        })

        it('should get the right report (3)', () => {
          const reportLines = stdout.split('\n')
          const finalLine = '9 problems (9 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })
      })

      it('should check FOO1 does not change after test (3)', () => {
        result = compareTextFiles(currentFile, beforeFixFile)
        expect(result).to.be.true
      })
    })

    describe('autofix rule: private-vars-leading-underscore', () => {
      before(function () {
        params = retrieveParams('private-vars-underscore/')
        currentConfig = `${params.path}${params.subpath}.solhint.json`
        currentFile = `${params.path}${params.subpath}Foo1.sol`
        beforeFixFile = `${params.path}${params.subpath}Foo1BeforeFix.sol`
        afterFixFile = `${params.path}${params.subpath}Foo1AfterFix.sol`
      })
      describe('--fix with noPrompt', () => {
        after(function () {
          if (!E2E) {
            copyFile(beforeFixFile, currentFile)
          }
        })

        it('should compare Foo1 file with template BEFORE FIX file and they should match (4)', () => {
          result = compareTextFiles(currentFile, beforeFixFile)
          expect(result).to.be.true
        })

        it('should execute and compare Foo1 with template AFTER FIX and they should match (4)', () => {
          ({ code, stdout } = shell.exec(
            `${params.command} ${params.param1} -c ${currentConfig} ${currentFile} --fix --disc --noPrompt`
          ))

          result = compareTextFiles(currentFile, afterFixFile)
          expect(result).to.be.true
        })

        it('should execute and exit with code 1 (4)', () => {
          expect(code).to.equal(1)
        })

        it('should get the right report (4)', () => {
          const reportLines = stdout.split('\n')
          const finalLine = '19 problems (19 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })
      })

      it('should check FOO1 does not change after test (4)', () => {
        result = compareTextFiles(currentFile, beforeFixFile)
        expect(result).to.be.true
      })
    })

    describe('autofix rule: payable-fallback', () => {
      before(function () {
        params = retrieveParams('payable-fallback/')
        currentConfig = `${params.path}${params.subpath}.solhint.json`
        currentFile = `${params.path}${params.subpath}Foo1.sol`
        beforeFixFile = `${params.path}${params.subpath}Foo1BeforeFix.sol`
        afterFixFile = `${params.path}${params.subpath}Foo1AfterFix.sol`
      })
      describe('--fix with noPrompt', () => {
        after(function () {
          if (!E2E) {
            copyFile(beforeFixFile, currentFile)
          }
        })

        it('should compare Foo1 file with template BEFORE FIX file and they should match (5)', () => {
          result = compareTextFiles(currentFile, beforeFixFile)
          expect(result).to.be.true
        })

        it('should execute and compare Foo1 with template AFTER FIX and they should match (5)', () => {
          ({ code, stdout } = shell.exec(
            `${params.command} ${params.param1} -c ${currentConfig} ${currentFile} --fix --disc --noPrompt`
          ))

          result = compareTextFiles(currentFile, afterFixFile)
          expect(result).to.be.true
        })

        it('should execute and exit with code 1 (5)', () => {
          expect(code).to.equal(1)
        })

        it('should get the right report (5)', () => {
          const reportLines = stdout.split('\n')
          const finalLine = '11 problems (11 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })
      })

      it('should check FOO1 does not change after test (5)', () => {
        result = compareTextFiles(currentFile, beforeFixFile)
        expect(result).to.be.true
      })
    })

    describe('autofix rule: quotes', () => {
      describe('--fix with noPrompt SINGLE QUOTES', () => {
        before(function () {
          params = retrieveParams('quotes/')
          currentConfig = `${params.path}${params.subpath}.singleQuotes.json`
          currentFile = `${params.path}${params.subpath}Foo1.sol`
          beforeFixFile = `${params.path}${params.subpath}Foo1BeforeFix.sol`
          afterFixFile = `${params.path}${params.subpath}Foo1AfterFixSingle.sol`
        })

        after(function () {
          if (!E2E) {
            copyFile(beforeFixFile, currentFile)
          }
        })

        it('should compare Foo1 file with template BEFORE FIX file and they should match (6)', () => {
          result = compareTextFiles(currentFile, beforeFixFile)
          expect(result).to.be.true
        })

        it('should execute and compare Foo1 with template AFTER FIX and they should match (6)', () => {
          ({ code, stdout } = shell.exec(
            `${params.command} ${params.param1} -c ${currentConfig} ${currentFile} --fix --disc --noPrompt`
          ))

          result = compareTextFiles(currentFile, afterFixFile)
          expect(result).to.be.true
        })

        it('should execute and exit with code 1 (6)', () => {
          expect(code).to.equal(1)
        })

        it('should get the right report (6)', () => {
          const reportLines = stdout.split('\n')
          const finalLine = '8 problems (8 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })
      })

      describe('--fix with noPrompt DOUBLE QUOTES', () => {
        before(function () {
          params = retrieveParams('quotes/')
          currentConfig = `${params.path}${params.subpath}.doubleQuotes.json`
          currentFile = `${params.path}${params.subpath}Foo1.sol`
          beforeFixFile = `${params.path}${params.subpath}Foo1BeforeFix.sol`
          afterFixFile = `${params.path}${params.subpath}Foo1AfterFixDouble.sol`
        })

        after(function () {
          if (!E2E) {
            copyFile(beforeFixFile, currentFile)
          }
        })

        it('should compare Foo1 file with template BEFORE FIX file and they should match (6)', () => {
          result = compareTextFiles(currentFile, beforeFixFile)
          expect(result).to.be.true
        })

        it('should execute and compare Foo1 with template AFTER FIX and they should match (6)', () => {
          ({ code, stdout } = shell.exec(
            `${params.command} ${params.param1} -c ${currentConfig} ${currentFile} --fix --disc --noPrompt`
          ))

          result = compareTextFiles(currentFile, afterFixFile)
          expect(result).to.be.true
        })

        it('should execute and exit with code 1 (6)', () => {
          expect(code).to.equal(1)
        })

        it('should get the right report (6)', () => {
          const reportLines = stdout.split('\n')
          const finalLine = '8 problems (8 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })
      })

      it('should check FOO1 does not change after test (6)', () => {
        result = compareTextFiles(currentFile, beforeFixFile)
        expect(result).to.be.true
      })
    })
  })
})

// FALTA LA PRUEBA DEL STORE TO FILE
