const assert = require('assert')
const linter = require('./../lib/index')
const contractWith = require('./common/contract-builder').contractWith
const funcWith = require('./common/contract-builder').funcWith
const { noIndent } = require('./common/configs')
const {
  assertWarnsCount,
  assertErrorMessage,
  assertNoWarnings,
  assertErrorCount
} = require('./common/asserts')

describe('Linter - SecurityRules', () => {
  it('should return pragma error', () => {
    const report = linter.processStr('pragma solidity ^0.4.4;')

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'Compiler')
  })

  it('should return compiler version error', () => {
    const report = linter.processStr('pragma solidity 0.3.4;')

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('0.4'))
  })

  it('should return "send" call verification error', () => {
    const code = funcWith('x.send(55);')

    const report = linter.processStr(code, noIndent())

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('send'))
  })

  it('should return "call.value" verification error', () => {
    const code = funcWith('x.call.value(55)();')

    const report = linter.processStr(code, noIndent())

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('call.value'))
  })

  it('should return required visibility error', () => {
    const code = contractWith('function b() { }')

    const report = linter.processStr(code, noIndent())

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('visibility'))
  })

  it('should return required visibility error for state', () => {
    const code = contractWith('uint a;')

    const report = linter.processStr(code, noIndent())

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('visibility'))
  })

  it('should return that fallback must be simple', () => {
    const code = contractWith(`function () public payable {
            make1();
            make2();
            make3();
        }`)

    const report = linter.processStr(code, noIndent())

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('Fallback'))
  })

  it('should return error that function and event names are similar', () => {
    const code = contractWith(`
          event Name1();
          function name1() public payable { }
        `)

    const report = linter.processStr(code, noIndent())

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('Event and function names must be different'))
  })

  it('should return error that function and event names are similar', () => {
    const code = contractWith(`
          function name1() public payable { }
          event Name1();
        `)

    const report = linter.processStr(code, noIndent())

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('Event and function names must be different'))
  })

  // it('should return error that external contract is not marked as trusted / untrusted', function () {
  //     const code = funcWith('Bank.withdraw(100);');
  //
  //     const report = linter.processStr(code, config());
  //
  //     assert.equal(report.warningCount, 1);
  //     assert.ok(report.reports[0].message.includes('trusted'));
  // });

  const DEPRECATION_ERRORS = ['sha3("test");', 'throw;', 'suicide();']

  DEPRECATION_ERRORS.forEach(curText =>
    it(`should return error that used deprecations ${curText}`, () => {
      const code = funcWith(curText)

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.reports[0].message.includes('deprecate'))
    })
  )

  const ALMOST_DEPRECATION_ERRORS = ['sha33("test");', 'throwing;', 'suicides();']

  ALMOST_DEPRECATION_ERRORS.forEach(curText =>
    it(`should not return error when doing ${curText}`, () => {
      const code = funcWith(curText)

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 0)
    })
  )

  it('should return error that multiple send calls used in transation', () => {
    const code = funcWith(`
          uint aRes = a.send(1);
          uint bRes = b.send(2);
        `)

    const report = linter.processStr(code, noIndent())

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('multiple'))
  })

  it('should return error that multiple send calls used in loop', () => {
    const code = funcWith(`
          while (ac > b) { uint res = a.send(1); }
        `)

    const report = linter.processStr(code, noIndent())

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'multiple')
  })

  it('should return error that used tx.origin', () => {
    const code = funcWith(`
          uint aRes = tx.origin;
        `)

    const report = linter.processStr(code, noIndent())

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 'origin')
  })

  const TIME_BASED_LOGIC = [
    funcWith('now >= start + daysAfter * 1 days;'),
    funcWith('start >= block.timestamp + daysAfter * 1 days;')
  ]

  TIME_BASED_LOGIC.forEach(curCode =>
    it('should return warn when business logic rely on time', () => {
      const report = linter.processStr(curCode, noIndent())

      assertWarnsCount(report, 1)
      assertErrorMessage(report, 'time')
    })
  )

  it('should return warn when function use inline assembly', () => {
    const code = funcWith(' assembly { "test" } ')

    const report = linter.processStr(code, noIndent())

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'assembly')
  })

  it('should return warn when function rely on block has', () => {
    const code = funcWith('end >= block.blockhash + daysAfter * 1 days;')

    const report = linter.processStr(code, noIndent())

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'block.blockhash')
  })

  describe('Reentrancy', () => {
    const REENTRANCY_ERROR = [
      contractWith(`
                mapping(address => uint) private shares;

                function b() external {
                    uint amount = shares[msg.sender];
                    bool a = msg.sender.send(amount);
                    if (a) { shares[msg.sender] = 0; }
                }
            `),
      contractWith(`
                mapping(address => uint) private shares;

                function b() external {
                    uint amount = shares[msg.sender];
                    msg.sender.transfer(amount);
                    shares[msg.sender] = 0;
                }
            `)
    ]

    REENTRANCY_ERROR.forEach(curCode =>
      it('should return warn when code contains possible reentrancy', () => {
        const report = linter.processStr(curCode, noIndent())

        assertWarnsCount(report, 1)
        assertErrorMessage(report, 'reentrancy')
      })
    )

    const NO_REENTRANCY_ERRORS = [
      contractWith(`
                mapping(address => uint) private shares;

                function b() external {
                    uint amount = shares[msg.sender];
                    shares[msg.sender] = 0;
                    msg.sender.transfer(amount);
                }
            `),
      contractWith(`
                mapping(address => uint) private shares;

                function b() external {
                    uint amount = shares[msg.sender];
                    user.test(amount);
                    shares[msg.sender] = 0;
                }
            `),
      funcWith(`
                uint[] shares;
                uint amount = shares[msg.sender];
                msg.sender.transfer(amount);
                shares[msg.sender] = 0;
            `)
    ]

    NO_REENTRANCY_ERRORS.forEach(curCode =>
      it('should not return warn when code do not contains transfer', () => {
        const report = linter.processStr(curCode, noIndent())

        assertNoWarnings(report)
      })
    )
  })

  describe('Avoid low level calls', () => {
    const LOW_LEVEL_CALLS = [
      funcWith('msg.sender.call(code);'),
      funcWith('a.callcode(test1);'),
      funcWith('a.delegatecall(test1);')
    ]

    LOW_LEVEL_CALLS.forEach(curCode =>
      it('should return warn when code contains possible reentrancy', () => {
        const report = linter.processStr(curCode, noIndent())

        assertWarnsCount(report, 1)
        assertErrorMessage(report, 'low level')
      })
    )
  })
})
