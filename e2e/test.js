const { expect } = require('chai')
const cp = require('child_process')
const fs = require('fs-extra')
const getStream = require('get-stream')
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
  describe('no config', function () {
    useFixture('01-no-config')

    it('should fail', function () {
      const { code } = shell.exec('solhint Foo.sol')

      expect(code).to.equal(1)
    })

    it('should create an initial config with --init', function () {
      const { code } = shell.exec('solhint --init')

      expect(code).to.equal(0)

      const solhintConfigPath = path.join(this.testDirPath, '.solhint.json')

      expect(fs.existsSync(solhintConfigPath)).to.be.true
    })

    it('should print usage if called without arguments', function () {
      const { code, stdout } = shell.exec('solhint')

      expect(code).to.equal(0)
      expect(stdout).to.include('Usage: solhint [options]')
      expect(stdout).to.include('Linter for Solidity programming language')
      expect(stdout).to.include('linting of source code data provided to STDIN')
    })
  })

  describe('empty-config', function () {
    useFixture('02-empty-solhint-json')

    it('should print nothing', function () {
      const { code, stdout } = shell.exec('solhint Foo.sol')

      expect(code).to.equal(0)
      expect(stdout.trim()).to.equal('')
    })

    it('should show warning when using --init', function () {
      const { code, stdout } = shell.exec('solhint --init')

      expect(code).to.equal(0)
      expect(stdout.trim()).to.equal('Configuration file already exists')
    })
  })

  describe('no-empty-blocks', function () {
    useFixture('03-no-empty-blocks')

    it('should exit with 1', function () {
      const { code, stdout } = shell.exec('solhint Foo.sol')

      expect(code).to.equal(1)
      expect(stdout.trim()).to.contain('Code contains empty blocks')
    })

    it('should work with stdin', async function () {
      const child = cp.exec('solhint stdin')

      const stdoutPromise = getStream(child.stdout)

      const codePromise = new Promise((resolve) => {
        child.on('close', (code) => {
          resolve(code)
        })
      })

      child.stdin.write('contract Foo {}')
      child.stdin.end()

      const code = await codePromise

      expect(code).to.equal(1)

      const stdout = await stdoutPromise

      expect(stdout.trim()).to.contain('Code contains empty blocks')
    })
  })

  describe('.sol on path', function () {
    useFixture('04-dotSol-on-path')

    it('should handle directory names that end with .sol', function () {
      const { code } = shell.exec('solhint contracts/**/*.sol')
      expect(code).to.equal(0)
    })
  })

  describe('--max-warnings parameter tests', function () {
    // Foo contract has 6 warnings
    // Foo2 contract has 1 error and 14 warnings
    useFixture('05-max-warnings')
    const warningExceededMsg = 'Solhint found more warnings than the maximum specified'
    const errorFound =
      'Error/s found on rules! [max-warnings] param is ignored. Fixing errors enables max-warnings'

    it('should not display [warnings exceeded] for max 7 warnings', function () {
      const { code, stdout } = shell.exec('solhint contracts/Foo.sol --max-warnings 7')
      expect(code).to.equal(0)
      expect(stdout.trim()).to.not.contain(warningExceededMsg)
    })

    it('should display [warnings exceeded] for max 3 warnings and exit error 1', function () {
      const { code, stdout } = shell.exec('solhint contracts/Foo.sol --max-warnings 3')
      const { code, stdout } = shell.exec('solhint contracts/Foo.sol --max-warnings 3')

      expect(code).to.equal(1)
      expect(stdout.trim()).to.contain(warningExceededMsg)
    })

    it('should return error for Compiler version rule, ignoring 3 --max-warnings', function () {
      const { code, stdout } = shell.exec('solhint contracts/Foo2.sol --max-warnings 3')

      expect(code).to.equal(1)
      expect(stdout.trim()).to.contain(errorFound)
    })

    it('should return error for Compiler version rule. No message for max-warnings', function () {
      const { code, stdout } = shell.exec('solhint contracts/Foo2.sol --max-warnings 27')
      expect(code).to.equal(1)
      expect(stdout.trim()).to.not.contain(errorFound)
    })
  })
})
