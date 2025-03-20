const assert = require('assert')
const linter = require('../../../lib/index')

const ERROR_MSG = 'GC: ERC721 import found - Use of ERC1155 recommended'

describe('Linter - gas-multitoken1155', () => {
  it('should raise error', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    import '@openzeppelin/contracts/token/ERC722/ERC722.sol';
    import '@openzeppelin/contracts/token/erc721.sol';
    import '@openzeppelin/contracts/token/ERC721.sol';

    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'gas-multitoken1155': 'error' },
    })

    assert.equal(report.errorCount, 2)
    assert.equal(report.messages[0].message, ERROR_MSG)
    assert.equal(report.messages[1].message, ERROR_MSG)
  })

  it('should raise error', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    import '@openzeppelin/contracts/token/ERC721/ERC722.sol';

    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'gas-multitoken1155': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    import '@openzeppelin/contracts/token/ERC722/ERC722.sol';
    import '@openzeppelin/contracts/token/erc20.sol';
    
    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'gas-multitoken1155': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })
})
