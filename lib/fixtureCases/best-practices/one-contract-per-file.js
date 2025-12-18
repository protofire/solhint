const ONE_CONTRACT = `
    pragma solidity 0.8.0;
    
    contract A {
        uint256 public constant TESTA = "testA";
    }
    `

const TWO_CONTRACTS = `
    pragma solidity 0.8.0;
    
    contract A {
        uint256 public constant TESTA = "testA";
    }

    contract B {
        uint256 public constant TESTB = "testB";
    }
    `

const THREE_CONTRACTS = `
    pragma solidity 0.8.0;
    
    contract A {
        uint256 public constant TESTA = "testA";
    }

    contract B {
        uint256 public constant TESTB = "testB";
    }

    contract C {
        uint256 public constant TESTC = "testC";
    }
    `

const TWO_LIBRARIES = `
    pragma solidity 0.8.0;
    
    library A { }

    library B { }
    `

const ONE_CONTRACT_WITH_INTERFACES = `
    pragma solidity 0.8.0;
    
    contract A { }

    interface B { }

    interface C { }
    `

const ONE_LIBRARY_WITH_INTERFACES = `
    pragma solidity 0.8.0;
    
    library A { }

    interface B { }

    interface C { }
    `

module.exports = {
  ONE_CONTRACT,
  TWO_CONTRACTS,
  THREE_CONTRACTS,
  TWO_LIBRARIES,
  ONE_CONTRACT_WITH_INTERFACES,
  ONE_LIBRARY_WITH_INTERFACES,
}
