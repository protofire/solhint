const chai = require('chai')
const { expect } = chai
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const shell = require('shelljs')
const spawnSync = require('spawn-sync')

const E2E = true

function retrieveParams() {
  if (E2E) {
    return { command: 'solhint', param1: '' }
  } else {
    return { command: 'node', param1: 'solhint' }
  }
}

function compareTextFiles(file1Path, file2Path) {
  const file1Content = fs.readFileSync(file1Path, 'utf-8')
  const file2Content = fs.readFileSync(file2Path, 'utf-8')

  return file1Content === file2Content
}

function copyFile(sourcePath, destinationPath) {
  // Read the content from the source file
  const content = fs.readFileSync(sourcePath)

  // Write the content to the destination file, overwriting it if it exists
  fs.writeFileSync(destinationPath, content)
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

  describe('autofix tests', () => {
    if (E2E) {
      useFixture('08-autofix')
    }

    describe('autofix command line options', () => {
      const commands = retrieveParams()
      let PATH = 'e2e/08-autofix/'
      let SUBPATH = 'contracts/00-generic/'
      let sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
      let currentFile = `${PATH}${SUBPATH}Foo1.sol`

      describe('--fix without noPrompt', () => {
        after(function () {
          copyFile(sourceFilePath, currentFile)
        })

        it('should terminate with --fix and user choose NOT to continue', () => {

          shell.exec(
            `pwd`
          )

          const solhintProcess = spawnSync(
            `${commands.command}`,
            [
              `${commands.param1}`,
              '-c',
              `${PATH}${SUBPATH}.solhint.json`,
              `${PATH}${SUBPATH}Foo1.sol`,
              '--fix',
              '--disc',
            ],
            {
              input: 'n\n', // Provide 'n' as input
            }
          )

          expect(solhintProcess.status).to.equal(0)
          expect(solhintProcess.stdout.toString().includes('Process terminated by user'))
        })

        it('should fix with --fix and user choose YES to continue', () => {
          sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
          currentFile = `${PATH}${SUBPATH}Foo1.sol`

          result = compareTextFiles(sourceFilePath, `${PATH}${SUBPATH}Foo1.sol`)
          expect(result).to.be.true

          const solhintProcess = spawnSync(
            `${commands.command}`,
            [
              `${commands.param1}`,
              '-c',
              `${PATH}${SUBPATH}.solhint.json`,
              currentFile,
              '--fix',
              '--disc',
            ],
            {
              input: 'y\n', // Provide 'y' as input
            }
          )

          expect(solhintProcess.status).to.equal(1)
          expect(solhintProcess.stdout.toString().includes('5 problems (5 errors, 0 warnings)'))
        })

        it('should compare resulted file with template file and they should match 1', () => {
          result = compareTextFiles(currentFile, `${PATH}${SUBPATH}Foo1AfterFix.sol`)
          expect(result).to.be.true
        })
      })

      describe('--fix with noPrompt', () => {
        after(function () {
          copyFile(sourceFilePath, currentFile)
        })
        it('should fix file when noPrompt', () => {
          sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
          currentFile = `${PATH}${SUBPATH}Foo1.sol`

          result = compareTextFiles(sourceFilePath, `${PATH}${SUBPATH}Foo1.sol`)
          expect(result).to.be.true

          const { code, stdout } = shell.exec(
            `${commands.command} ${commands.param1} -c ${PATH}${SUBPATH}.solhint.json ${currentFile} --fix --disc --noPrompt`
          )

          expect(code).to.equal(1)

          const reportLines = stdout.split('\n')
          const finalLine = '5 problems (5 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })

        it('files should match', () => {
          result = compareTextFiles(currentFile, `${PATH}${SUBPATH}Foo1AfterFix.sol`)
          expect(result).to.be.true
        })
      })

    })

    describe('autofix rule: explicit-types', () => {
      describe('--fix with noPrompt', () => {
        const commands = retrieveParams()
        let PATH = 'e2e/08-autofix/'
        let SUBPATH = 'contracts/explicit-types/'
        let sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
        let currentFile = `${PATH}${SUBPATH}Foo1.sol`
        after(function () {
          copyFile(sourceFilePath, currentFile)
        })
        it('should fix file when noPrompt', () => {
          sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
          currentFile = `${PATH}${SUBPATH}Foo1.sol`

          result = compareTextFiles(sourceFilePath, `${PATH}${SUBPATH}Foo1.sol`)
          expect(result).to.be.true

          const { code, stdout } = shell.exec(
            `${commands.command} ${commands.param1} -c ${PATH}${SUBPATH}.solhint.json ${currentFile} --fix --disc --noPrompt`
          )

          expect(code).to.equal(1)

          const reportLines = stdout.split('\n')
          const finalLine = '5 problems (5 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })

        it('files should match', () => {
          result = compareTextFiles(currentFile, `${PATH}${SUBPATH}Foo1AfterFix.sol`)
          expect(result).to.be.true
        })
      })
    })

    describe('autofix rule: no-console', () => {
      describe('--fix with noPrompt', () => {
        const commands = retrieveParams()
        let PATH = 'e2e/08-autofix/'
        let SUBPATH = 'contracts/no-console/'
        let sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
        let currentFile = `${PATH}${SUBPATH}Foo1.sol`
        after(function () {
          copyFile(sourceFilePath, currentFile)
        })
        it('should fix file when noPrompt', () => {
          sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
          currentFile = `${PATH}${SUBPATH}Foo1.sol`

          result = compareTextFiles(sourceFilePath, `${PATH}${SUBPATH}Foo1.sol`)
          expect(result).to.be.true

          const { code, stdout } = shell.exec(
            `${commands.command} ${commands.param1} -c ${PATH}${SUBPATH}.solhint.json ${currentFile} --fix --disc --noPrompt`
          )

          expect(code).to.equal(1)

          const reportLines = stdout.split('\n')
          const finalLine = '9 problems (9 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })

        it('files should match', () => {
          result = compareTextFiles(currentFile, `${PATH}${SUBPATH}Foo1AfterFix.sol`)
          expect(result).to.be.true
        })
      })
    })

    describe('autofix rule: private-vars-leading-underscore', () => {
      describe('--fix with noPrompt', () => {
        const commands = retrieveParams()
        let PATH = 'e2e/08-autofix/'
        let SUBPATH = 'contracts/private-vars-underscore/'
        let sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
        let currentFile = `${PATH}${SUBPATH}Foo1.sol`
        after(function () {
          copyFile(sourceFilePath, currentFile)
        })
        it('should fix file when noPrompt', () => {
          sourceFilePath = `${PATH}${SUBPATH}Foo1BeforeFix.sol`
          currentFile = `${PATH}${SUBPATH}Foo1.sol`

          result = compareTextFiles(sourceFilePath, `${PATH}${SUBPATH}Foo1.sol`)
          expect(result).to.be.true

          const { code, stdout } = shell.exec(
            `${commands.command} ${commands.param1} -c ${PATH}${SUBPATH}.solhint.json ${currentFile} --fix --disc --noPrompt`
          )

          expect(code).to.equal(1)

          const reportLines = stdout.split('\n')
          const finalLine = '27 problems (27 errors, 0 warnings)'
          expect(reportLines[reportLines.length - 3]).to.contain(finalLine)
        })

        it('files should match', () => {
          result = compareTextFiles(currentFile, `${PATH}${SUBPATH}Foo1AfterFix.sol`)
          expect(result).to.be.true
        })
      })
    })
  })
})
