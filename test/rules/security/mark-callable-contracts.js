const assert = require('assert')
const linter = require('./../../../lib/index')
const { funcWith, contractWith } = require('./../../common/contract-builder')

describe('Linter - mark-callable-contracts', () => {
  it('should return error that external contract is not marked as trusted / untrusted', () => {
    const code = funcWith('Bank.withdraw(100);')

    const report = linter.processStr(code, {
      rules: { 'mark-callable-contracts': 'warn' }
    })

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('trusted'))
  })

  it('should not return error for a struct', () => {
    const code = contractWith(`
  struct Token {
    address tokenAddress;
    string tokenSymbol;
  }

  mapping(address => Token) public acceptedTokens;

  function b(address tokenAddress, string memory tokenSymbol) public {
    Token memory token = Token(tokenAddress, tokenSymbol);
    acceptedTokens[tokenAddress] = token;
  }
    `)

    const report = linter.processStr(code, {
      rules: { 'mark-callable-contracts': 'warn' }
    })

    assert.equal(report.warningCount, 0)
  })
})
