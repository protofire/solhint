const assert = require('assert')
const { processStr } = require('../../../lib/index')
const { contractWith } = require('../../common/contract-builder')

const config = {
  rules: { 'non-state-vars-leading-underscore': 'error' },
}

describe('non-state-vars-leading-underscore', () => {
  ;[
    {
      description: 'struct member',
      underscore: contractWith('struct Foo { uint256 _foo; }'),
      noUnderscore: contractWith('struct Foo { uint256 _foo; }'),
    },
    {
      description: 'event parameter',
      underscore: contractWith('event Foo ( uint256 _foo );'),
      noUnderscore: contractWith('event Foo ( uint256 foo );'),
    },
    {
      description: 'custom error parameter',
      underscore: contractWith('error Foo ( uint256 _foo );'),
      noUnderscore: contractWith('error Foo ( uint256 foo );'),
    },
  ].forEach(({ description, underscore, noUnderscore }) => {
    describe(`${description} names should be ignored since they just define a type`, function () {
      it('they can start with underscore', function () {
        const report = processStr(underscore, config)
        assert.equal(report.errorCount, 0)
      })
      it('they can start without underscore', function () {
        const report = processStr(noUnderscore, config)
        assert.equal(report.errorCount, 0)
      })
    })
  })
  describe("'state' vars that dont actually use storage should start with underscore", function () {
    ;[
      {
        description: 'immutable variable',
        underscore: contractWith('uint256 immutable public _FOO;'),
        noUnderscore: contractWith('uint256 immutable public FOO;'),
      },
      {
        description: 'constant variable',
        underscore: contractWith('uint256 constant public _FOO;'),
        noUnderscore: contractWith('uint256 constant public FOO;'),
      },
    ].forEach(({ description, underscore, noUnderscore }) => {
      it(`should raise an error if a ${description} does not start with an underscore`, () => {
        const report = processStr(noUnderscore, config)
        assert.equal(report.errorCount, 1)
        assert(report.messages[0].message.includes('should start with _'))
      })

      it(`should NOT raise an error if a ${description} starts with an underscore`, () => {
        const report = processStr(underscore, config)
        assert.equal(report.errorCount, 0)
      })
    })
  })
  describe('non state vars should have a leading underscore', function () {
    ;[
      {
        description: 'block variable',
        underscore: contractWith('function foo() public { uint _myVar; }'),
        noUnderscore: contractWith('function foo() public { uint myVar; }'),
      },
      {
        description: 'return variable',
        underscore: contractWith('function foo() public returns (uint256 _foo){}'),
        noUnderscore: contractWith('function foo() public returns (uint256 foo){}'),
      },
      {
        description: 'function param',
        underscore: contractWith('function foo( uint256 _foo ) public {}'),
        noUnderscore: contractWith('function foo( uint256 foo ) public {}'),
      },
      {
        description: 'file-level constant',
        underscore: 'uint256 constant _IMPORTANT_VALUE = 420;',
        noUnderscore: 'uint256 constant IMPORTANT_VALUE = 420;',
      },
    ].forEach(({ description, underscore, noUnderscore }) => {
      it(`should raise an error if a ${description} does not start with an underscore`, () => {
        const report = processStr(noUnderscore, config)
        assert.equal(report.errorCount, 1)
        assert(report.messages[0].message.includes('should start with _'))
      })

      it(`should NOT raise an error if a ${description} starts with an underscore`, () => {
        const report = processStr(underscore, config)
        assert.equal(report.errorCount, 0)
      })
    })
  })

  describe('state-using state vars should NOT have a leading underscore', function () {
    it(`should raise an error if a mutablestate variable starts with an underscore`, () => {
      const report = processStr(contractWith('uint256 _foo;'), config)
      assert.equal(report.errorCount, 1)
      assert(report.messages[0].message.includes('should not start with _'))
    })

    it(`should NOT raise an error if a mutable state variable doesnt start with an underscore`, () => {
      const report = processStr(contractWith('uint256 foo;'), config)
      assert.equal(report.errorCount, 0)
    })
  })
})
