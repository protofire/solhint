const { expect } = require('chai')
const cp = require('child_process')
const fs = require('fs-extra')
const getStream = require('get-stream')
const os = require('os')
const path = require('path')
const shell = require('shelljs')

const EXIT_CODES = { BAD_OPTIONS: 255, OK: 0, REPORTED_ERRORS: 1 }

describe('e2e general tests', function () {
  describe('no config', function () {
    const PATH = '01-no-config'
    useFixture(PATH)

    it('should fail when config file does not exists', function () {
      const { code, stderr } = shell.exec(`solhint Foo.sol -c ./no-config/.solhint.json`)

      expect(code).to.equal(EXIT_CODES.BAD_OPTIONS)
      expect(stderr).to.include("couldn't be found")
    })

    it('should create an initial config with --init', function () {
      const solhintConfigPath = path.join(this.testDirPath, '.solhint.json')
      expect(fs.existsSync(solhintConfigPath)).to.be.false

      const { code } = shell.exec(`solhint --init`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(fs.existsSync(solhintConfigPath)).to.be.true
    })

    it('should print usage if called without arguments', function () {
      const { code, stdout } = shell.exec(`solhint`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout).to.include('Usage: solhint [options]')
      expect(stdout).to.include('Linter for Solidity programming language')
      expect(stdout).to.include('linting of source code data provided to STDIN')
    })
  })

  describe('empty-config', function () {
    const PATH = '02-empty-solhint-json'
    useFixture(PATH)

    it('should print nothing', function () {
      const { code, stdout } = shell.exec(`solhint Foo.sol`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.equal('')
    })

    it('should show warning when using --init', function () {
      const { code, stderr } = shell.exec(`solhint --init`)

      expect(code).to.equal(EXIT_CODES.BAD_OPTIONS)
      expect(stderr).to.include('Configuration file already exists')
    })
  })

  describe('no-empty-blocks', function () {
    const PATH = '03-no-empty-blocks'
    useFixture(PATH)

    it('No contracts to lint should fail with appropriate message', function () {
      const { code, stderr } = shell.exec(`solhint Foo1.sol`)

      expect(code).to.equal(EXIT_CODES.BAD_OPTIONS)
      expect(stderr).to.include('No files to lint!')
    })

    it('should end with REPORTED_ERRORS = 1 because report contains errors', function () {
      const { code, stdout } = shell.exec(`solhint Foo.sol`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain('Code contains empty blocks')
      expect(stdout.trim()).to.contain('Join SOLHINT Community')
    })

    it('should end with REPORTED_ERRORS = 1 and no Poster to join Discord', function () {
      const { code, stdout } = shell.exec(`solhint --noPoster Foo.sol`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain('Code contains empty blocks')
      expect(stdout.trim()).to.not.contain('Join SOLHINT Community')
    })

    it('should work with stdin, exit 0, found 1 error', async function () {
      const child = cp.exec(`solhint stdin Foo.sol`)

      const stdoutPromise = getStream(child.stdout)

      const codePromise = new Promise((resolve) => {
        child.on('close', (code) => {
          resolve(code)
        })
      })

      child.stdin.write('contract Foo {}')
      child.stdin.end()

      const code = await codePromise
      const stdout = await stdoutPromise

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain('Code contains empty blocks')
    })
  })

  describe('.sol on path', function () {
    const PATH = '04-dotSol-on-path'
    useFixture(PATH)

    it('should handle directory names that end with .sol', function () {
      const { code } = shell.exec(`solhint contracts/**/*.sol`)
      expect(code).to.equal(EXIT_CODES.OK)
    })
  })

  describe('--max-warnings parameter tests', function () {
    const PATH = '05-max-warnings'
    useFixture(PATH)

    // Foo contract has 6 warnings
    // Foo2 contract has 1 error and 14 warnings
    const warningExceededMsg = 'Solhint found more warnings than the maximum specified'
    const errorFound =
      'Error/s found on rules! [max-warnings] param is ignored. Fixing errors enables max-warnings'

    it('should not display [warnings exceeded] for max 7 warnings', function () {
      const { code, stdout } = shell.exec(`solhint contracts/Foo.sol --max-warnings 7`)
      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.not.contain(warningExceededMsg)
    })

    it('should display [warnings exceeded] for max 3 warnings and exit with 1', function () {
      const { code, stdout } = shell.exec(`solhint contracts/Foo.sol --max-warnings 3`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(warningExceededMsg)
    })

    it('should return error for Compiler version rule, ignoring 3 --max-warnings', function () {
      const { code, stdout } = shell.exec(`solhint contracts/Foo2.sol --max-warnings 3`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(errorFound)
    })

    it('should return error for Compiler version rule. No message for max-warnings', function () {
      const { code, stdout } = shell.exec(`solhint contracts/Foo2.sol --max-warnings 27`)
      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.not.contain(errorFound)
    })

    it('should NOT display warnings nor error but exit with 1 because max is 3 warnings', function () {
      const { code } = shell.exec(`solhint contracts/Foo.sol --max-warnings 3 -q`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
    })

    it('should exit with code 1 if one of evaluated contracts contains errors', function () {
      const { code } = shell.exec(`solhint contracts/Foo.sol contracts/Foo2.sol`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
    })
  })

  describe('foundry-test-functions with shell', () => {
    const PATH = '07-foundry-test'
    useFixture(PATH)

    // Foo contract has 1 warning
    // FooTest contract has 1 error

    it(`should raise error for empty blocks only`, () => {
      const { code, stdout } = shell.exec(`solhint contracts/Foo.sol`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.contain('Code contains empty blocks')
    })

    it(`should raise error for wrongFunctionDefinitionName() only`, () => {
      const SUFFIX2 = `-c test/.solhint.json --disc`

      const { code, stdout } = shell.exec(`solhint test/FooTest.sol ${SUFFIX2}`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(
        'Function wrongFunctionDefinitionName() must match Foundry test naming convention '
      )
    })
  })

  describe('import-path-check', () => {
    const PATH = '10-import-path-check/filesystem'

    let folderCounter = 1

    beforeEach(() => {
      const padded = String(folderCounter).padStart(2, '0')

      const ROOT = PATH + padded + '/'
      useFixtureFolder(this, ROOT + 'project')

      folderCounter++
    })

    it('Should succeed when relative import (same folder) - filesystem01', () => {
      const { code, stdout } = shell.exec(`solhint -c ".solhintS01.json" "./contracts/Test.sol"`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.be.empty
    })

    it('Should succeed when relative import with parent folder - filesystem02', () => {
      const { code, stdout } = shell.exec(`solhint -c ".solhintS02.json" "./contracts/Test.sol"`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.be.empty
    })

    it('Should succeed when importing from node_modules - filesystem03', () => {
      const fileName = 'node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol'
      createDummyFile(fileName)

      const { code, stdout } = shell.exec(`solhint -c ".solhintS03.json" "./contracts/Test.sol"`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.be.empty
    })

    it('Should fail when missing import (relative path) - filesystem04', () => {
      const { code, stdout } = shell.exec(`solhint -c ".solhintF04.json" "./contracts/Test.sol"`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(
        "Import in ./contracts/Test.sol doesn't exist in: ./Missing.sol"
      )
    })
  })

  describe('config-hierarchy-test', () => {
    const PATH = '11-multiple-configs'
    const ERROR_CONSOLE = 'Unexpected console statement'
    const ERROR_QUOTES = 'quotes for string literals'

    useFixture(PATH)

    it(`should inherit no-console rule from root and add contract folder config rules`, () => {
      const { code, stdout } = shell.exec(`solhint contracts/RootAndContractRules.sol`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(ERROR_CONSOLE)
      expect(stdout.trim()).to.contain(ERROR_QUOTES)
    })

    it(`should inherit both rules from root `, () => {
      const { code, stdout } = shell.exec(`solhint src/RootRules.sol`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(ERROR_CONSOLE)
      expect(stdout.trim()).to.contain(ERROR_QUOTES)
    })

    it(`should override no console and quotes rules`, () => {
      const { code, stdout } = shell.exec(`solhint src/interfaces/InterfaceRules.sol`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.be.empty
    })
  })
})

function useFixture(dir) {
  beforeEach(`switch to ${dir}`, function () {
    useFixtureFolder(this, dir)
  })
}

function useFixtureFolder(ctx, dir) {
  const fixturePath = path.join(__dirname, dir)

  const tmpDirContainer = os.tmpdir()
  const testDirPath = path.join(tmpDirContainer, `solhint-tests-${dir}`)

  ctx.testDirPath = testDirPath

  fs.ensureDirSync(testDirPath)
  fs.emptyDirSync(testDirPath)
  fs.copySync(fixturePath, testDirPath)

  shell.cd(testDirPath)
}

function createDummyFile(fullFilePath, content = '// dummy file\npragma solidity ^0.8.0;') {
  const dir = path.dirname(fullFilePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(fullFilePath, content)
}
