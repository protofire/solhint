const BaseChecker = require('../base-checker')

const ruleId = 'gas-multitoken1155'
const meta = {
  type: 'gas-consumption',

  docs: {
    description: 'ERC1155 is a cheaper non-fungible token than ERC721',
    category: 'Gas Consumption Rules',
    notes: [
      {
        note: '[source](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b&utm_campaign=42ccb5d8-c2cc-4416-b661-8eec8368f72b&utm_source=so&utm_medium=mail&utm_content=40a3d3be-d07d-479e-af1d-6b2ef1b950da&cid=9619984a-b43c-4002-ba71-820fd72bb83a#viewer-8v8t9) of the rule initiciative',
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class GasMultitoken1155 extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  hasERC721String(path) {
    // Convert both the input string and the substring to lowercase for case-insensitive comparison
    const lowercaseInput = path.toLowerCase()
    const lowercaseSubstring = 'erc721'

    // Check if the lowercase input string contains the lowercase substring
    return lowercaseInput.includes(lowercaseSubstring)
  }

  ImportDirective(node) {
    if (this.hasERC721String(node.path)) {
      this.error(node, 'GC: ERC721 import found - Use of ERC1155 recommended')
    }
  }
}

module.exports = GasMultitoken1155
