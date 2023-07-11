const jsonResult = [
    {
      line: 2,
      column: 1,
      severity: 'Error',
      message: 'Compiler version ^0.8.19 does not satisfy the ^0.5.8 semver requirement',
      ruleId: 'compiler-version',
      fix: null,
      filePath: './contracts/AccessControlFacet.sol'
    },
    {
      line: 5,
      column: 5,
      severity: 'Warning',
      message: 'Variable name must be in mixedCase',
      ruleId: 'var-name-mixedcase',
      fix: null,
      filePath: './contracts/AccessControlFacet.sol'
    },
    {
      line: 7,
      column: 5,
      severity: 'Warning',
      message: 'Explicitly mark visibility in function (Set ignoreConstructors to true if using solidity >=0.7.0)',
      ruleId: 'func-visibility',
      fix: null,
      filePath: './contracts/AccessControlFacet.sol'
    },
    {
      line: 7,
      column: 19,
      severity: 'Warning',
      message: 'Code contains empty blocks',
      ruleId: 'no-empty-blocks',
      fix: null,
      filePath: './contracts/AccessControlFacet.sol'
    },
    {
      line: 9,
      column: 5,
      severity: 'Warning',
      message: 'All public or external methods in a contract must override a definition from an interface',
      ruleId: 'comprehensive-interface',
      fix: null,
      filePath: './contracts/AccessControlFacet.sol'
    },
    {
      line: 11,
      column: 9,
      severity: 'Warning',
      message: 'Use "keccak256" instead of deprecated "sha3"',
      ruleId: 'avoid-sha3',
      filePath: './contracts/AccessControlFacet.sol'
    },
    {
      line: 12,
      column: 9,
      severity: 'Warning',
      message: '"throw" is deprecated, avoid to use it',
      ruleId: 'avoid-throw',
      filePath: './contracts/AccessControlFacet.sol'
    }
  ]
  
  module.exports = jsonResult
