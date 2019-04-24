const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith
const funcWith = require('./../../common/contract-builder').funcWith
const { assertWarnsCount, assertErrorMessage, assertNoWarnings } = require('./../../common/asserts')

describe('Linter - reentrancy', () => {
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
      const report = linter.processStr(curCode, {
        rules: { reentrancy: 'warn' }
      })

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
      const report = linter.processStr(curCode, {
        rules: { reentrancy: 'warn' }
      })

      assertNoWarnings(report)
    })
  )
})
