/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-expressions */

const {expect} = require('chai')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const shell = require('shelljs')

function useFixture(dir) {
  beforeEach(`switch to ${dir}`, function() {
    const fixturePath = path.join(__dirname, dir)

    const tmpDirContainer = os.tmpdir()
    this.testDirPath = path.join(tmpDirContainer, `solhint-tests-${dir}`)

    fs.ensureDirSync(this.testDirPath)
    fs.emptyDirSync(this.testDirPath)

    fs.copySync(fixturePath, this.testDirPath)

    shell.cd(this.testDirPath)
  })
}

describe('e2e', function() {
  describe('no config', function() {
    useFixture('01-no-config')

    it('should fail', function() {
      const {code} = shell.exec('solhint Foo.sol')

      expect(code).to.equal(1)
    })

    it('should create an initial config with --init', function() {
      const {code} = shell.exec('solhint --init')

      expect(code).to.equal(0)

      const solhintConfigPath = path.join(this.testDirPath, '.solhint.json')

      expect(fs.existsSync(solhintConfigPath)).to.be.true
    })

    it('should print usage if called without arguments', function() {
      const {code, stdout} = shell.exec('solhint')

      expect(code).to.equal(0)

      expect(stdout).to.include('Usage: solhint [options]')
      expect(stdout).to.include('Linter for Solidity programming language')
      expect(stdout).to.include('linting of source code data provided to STDIN')
    })
  })

  describe('empty-config', function() {
    useFixture('02-empty-solhint-json')

    it('should print nothing', function() {
      const {code, stdout} = shell.exec('solhint Foo.sol')

      expect(code).to.equal(0)

      expect(stdout.trim()).to.equal('')
    })

    it('should show warning when using --init', function() {
      const {code, stdout} = shell.exec('solhint --init')

      expect(code).to.equal(0)

      expect(stdout.trim()).to.equal('Configuration file already exists')
    })
  })
})
