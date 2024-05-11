const { expect } = require('chai')
const cp = require('child_process')
const fs = require('fs-extra')
const getStream = require('get-stream')
const os = require('os')
const path = require('path')
const shell = require('shelljs')

const EXIT_CODES = { BAD_OPTIONS: 255, OK: 0, REPORTED_ERRORS: 1 }

// ==================================================================
// use these lines to execute locally in TEST directory
// ==================================================================
// const E2E = false
// const NODE = 'node '

// ==================================================================
// use these lines to E2E
// ==================================================================
const E2E = true
const NODE = ''

function prepareContext(path) {
  let PREFIX
  let SUFFIX

  if (E2E) {
    useFixture(path)
    PREFIX = ''
    SUFFIX = ' --disc'
  } else {
    PREFIX = `./e2e/${path}/`
    SUFFIX = `-c ${PREFIX}.solhint.json --disc`
  }
  return { PREFIX, SUFFIX }
}

describe('e2e', function () {
  if (!E2E) shell.exec(`rm ./.solhint.json`)

  describe('no config', function () {
    const PATH = '01-no-config'
    prepareContext(PATH)

    it('should fail when config file does not exists', function () {
      const { code, stderr } = shell.exec(`${NODE}solhint Foo.sol -c ./noconfig/.solhint.json`)

      expect(code).to.equal(EXIT_CODES.BAD_OPTIONS)
      expect(stderr).to.include('couldnt be found')
    })

    it('should create an initial config with --init', function () {
      let solhintConfigPath
      if (E2E) solhintConfigPath = path.join(this.testDirPath, '.solhint.json')
      else solhintConfigPath = './.solhint.json'

      const { code } = shell.exec(`${NODE}solhint --init`)

      if (E2E) solhintConfigPath = path.join(this.testDirPath, '.solhint.json')
      else solhintConfigPath = './.solhint.json'

      expect(code).to.equal(EXIT_CODES.OK)
      expect(fs.existsSync(solhintConfigPath)).to.be.true
    })

    it('should print usage if called without arguments', function () {
      const { code, stdout } = shell.exec(`${NODE}solhint`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout).to.include('Usage: solhint [options]')
      expect(stdout).to.include('Linter for Solidity programming language')
      expect(stdout).to.include('linting of source code data provided to STDIN')
    })
  })

  describe('empty-config', function () {
    const PATH = '02-empty-solhint-json'
    const { PREFIX, SUFFIX } = prepareContext(PATH)

    it('should print nothing', function () {
      const { code, stdout } = shell.exec(`${NODE}solhint ${PREFIX}Foo.sol ${SUFFIX}`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.equal('')
    })

    it('should show warning when using --init', function () {
      const { code, stderr } = shell.exec(`${NODE}solhint --init`)
      
      expect(code).to.equal(EXIT_CODES.BAD_OPTIONS)
      expect(stderr).to.include('Configuration file already exists')
    })
  })

  describe('no-empty-blocks', function () {
    const PATH = '03-no-empty-blocks'
    const { PREFIX, SUFFIX } = prepareContext(PATH)

      it('No contracts to lint should fail with appropiate message', function () {
        const { code, stderr } = shell.exec(`${NODE}solhint Foo1.sol ${SUFFIX}`)
        
        expect(code).to.equal(EXIT_CODES.BAD_OPTIONS)
        expect(stderr).to.include('No files to lint!')
      })

    it('should end with REPORTED_ERRORS = 1 because report contains errors', function () {
      const { code, stdout } = shell.exec(`${NODE}solhint ${PREFIX}Foo.sol ${SUFFIX}`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain('Code contains empty blocks')
    })

    it('should work with stdin, exit 0, found 1 error', async function () {
      const child = cp.exec(`${NODE}solhint stdin ${PREFIX}Foo.sol ${SUFFIX}`)

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
    const { PREFIX, SUFFIX } = prepareContext(PATH)

    it('should handle directory names that end with .sol', function () {
      const { code } = shell.exec(`${NODE}solhint ${PREFIX}contracts/**/*.sol ${SUFFIX}`)
      expect(code).to.equal(EXIT_CODES.OK)
    })
  })

  describe('--max-warnings parameter tests', function () {
    const PATH = '05-max-warnings'
    const { PREFIX, SUFFIX } = prepareContext(PATH)

    // Foo contract has 6 warnings
    // Foo2 contract has 1 error and 14 warnings
    const warningExceededMsg = 'Solhint found more warnings than the maximum specified'
    const errorFound =
      'Error/s found on rules! [max-warnings] param is ignored. Fixing errors enables max-warnings'

    it('should not display [warnings exceeded] for max 7 warnings', function () {
      const { code, stdout } = shell.exec(
        `${NODE}solhint ${PREFIX}contracts/Foo.sol --max-warnings 7 ${SUFFIX}`
      )
      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.not.contain(warningExceededMsg)
    })

    it('should display [warnings exceeded] for max 3 warnings and exit with 1', function () {
      const { code, stdout } = shell.exec(
        `${NODE}solhint ${PREFIX}contracts/Foo.sol --max-warnings 3 ${SUFFIX}`
      )

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(warningExceededMsg)
    })

    it('should return error for Compiler version rule, ignoring 3 --max-warnings', function () {
      const { code, stdout } = shell.exec(
        `${NODE}solhint ${PREFIX}contracts/Foo2.sol --max-warnings 3 ${SUFFIX}`
      )

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(errorFound)
    })

    it('should return error for Compiler version rule. No message for max-warnings', function () {
      const { code, stdout } = shell.exec(
        `${NODE}solhint ${PREFIX}contracts/Foo2.sol --max-warnings 27 ${SUFFIX}`
      )
      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.not.contain(errorFound)
    })

    it('should NOT display warnings nor error but exit with 1 because max is 3 warnings', function () {
      const { code } = shell.exec(
        `${NODE}solhint ${PREFIX}contracts/Foo.sol --max-warnings 3 ${SUFFIX} -q`
      )

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
    })
  })

  describe('Linter - foundry-test-functions with shell', () => {
    const PATH = '07-foundry-test'
    const { PREFIX, SUFFIX } = prepareContext(PATH)

    // Foo contract has 1 warning
    // FooTest contract has 1 error

    it(`should raise error for empty blocks only`, () => {
      const { code, stdout } = shell.exec(`${NODE}solhint ${PREFIX}contracts/Foo.sol ${SUFFIX}`)

      expect(code).to.equal(EXIT_CODES.OK)
      expect(stdout.trim()).to.contain('Code contains empty blocks')
    })

    it(`should raise error for wrongFunctionDefinitionName() only`, () => {
      const SUFFIX2 = `-c ${PREFIX}test/.solhint.json --disc`
      
      const { code, stdout } = shell.exec(`${NODE}solhint ${PREFIX}test/FooTest.sol ${SUFFIX2}`)

      expect(code).to.equal(EXIT_CODES.REPORTED_ERRORS)
      expect(stdout.trim()).to.contain(
        'Function wrongFunctionDefinitionName() must match Foundry test naming convention '
      )
    })
  })
})

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
