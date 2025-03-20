const assert = require('assert')
const linter = require('../../../lib/index')

const ERROR_MSG = 'GC: String exceeds 32 bytes'

describe('Linter - gas-small-strings', () => {
  it('should raise error on file level constant', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    import '@openzeppelin/asdadada/adadadadada/adadadadadad/adadadadad/adadadadadad/adadadadad/adadadadad/contracts/token/ERC721.sol';
    
    string constant myStringConstantFile2 = 'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 1.';

    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error on import nor address longer than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    import '@openzeppelin/asdadada/adadadadada/adadadadadad/adadadadad/adadadadadad/adadadadad/adadadadad/contracts/token/ERC721.sol';
            
    address constant ownerConstantFile1 = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB000xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB000xA0b86991c6218b36c1d19D4a2e9Eb0cE3606';
    
    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error on state variable longer than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      string myStringState2 =
        'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 2.';
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error on state variable smaller than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      string myStringState1 = 'Hello, World 3';
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error on state variable (array) with one element longer than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      string[] public myArrayState2 = [
        'One',
        'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 4a',
        'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 4b'
      ];
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error on state variable (array) with all elements smaller than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      string[] public myArrayState1 = ['One', 'Two', 'Three'];
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error on constructor variable longer than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      constructor() {
        string myStringConstructor1 = 'Initialized in constructor';
        string myStringConstructor1 = 'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 7';
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error on constructor variable smaller than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      constructor() {
        string myStringConstructor1 = 'Initialized in constructor';        
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error on assignation of variable longer than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      function function1() external {
        myStringArray[0] = '1234';
        myStringArray[1] = 
          'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 8';
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error assignation of variable smaller than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      function function1() external {
        myStringArray[0] = '1234';       
        myStringArray[1] = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB00';
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error on event with msg longer than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      function function1() external {
        emit LogEvent('Event message');
        emit LogEvent(
            'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 9'
        );
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error on event with msg smaller than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      function function1() external {
        emit LogEvent('Event message');        
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error on require with msg longer than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      function function1() external {
        require(myBytesArray[0] == myBytesArray[1], 'Error message');
        require(
            myBytesArray[0] == myBytesArray[1],
            'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 10'
        );
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error on require with msg smaller than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      function function1() external {
        require(myBytesArray[0] == myBytesArray[1], 'Error message');
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error on retrurn with at least one element longer than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      function function1() external returns (address, string memory, string memory, uint256) {
        return (
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB00',
          'This is a test string larger than 32 bytes! It contains more characters to ensure it exceeds the specified size 13',
          'Returned String2',
          1
        );
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should NOT raise error on return with all elements smaller than 32 bytes', () => {
    const code = `
    // SPDX-License-Identifier: Apache-2.0
    pragma solidity ^0.8.4;

    contract A {
      function function1() external returns (address, string memory, string memory, uint256) {        
        return (
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB00',
          'Returned String1',
          'Returned String2',
          1
        );
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'gas-small-strings': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })
})
