// all contracts are made with two func-visibility errors

module.exports = [
  `
      // SPDX-License-Identifier: MIT
      pragma solidity 0.4.4;
      import "hardhat/console.sol";
  
      interface fufu {
          function intFunction() returns(bool);
          function intFunction() returns(uint256);
      }
  
      function freeAa() returns(bool) {
          return true;
      }
  
      contract A {
          uint256 public a;
  
          constructor() {
              a = 2;
          }
  
          function functionPublicViewA() returns (uint256) {
              if (freeAa()) return a;
              else return a+1;
          }
  
          function functionPublicPureA() public pure returns (bool) {
              return freeAa();
          }
      }
  
      function freeBb() returns(bool) {
          return true;
      }
  
      contract B {
          uint256 public a;
  
          constructor() {
              a = 2;
          }
  
          function functionPublicViewB() returns (uint256) {
              if (freeBb()) return a;
              else return a+1;
          }
  
          function functionPublicPureB() public pure returns (bool) {
              return freeCc();
          }
      }
  
      function freeCc() returns(bool) {
          return true;
      }
      `,
  `
      // SPDX-License-Identifier: MIT
      pragma solidity 0.8.4;
      import "hardhat/console.sol";
  
      function freeAa() returns(bool) {
          return true;
      }
  
      function freeBb() returns(bool) {
          return true;
      }
  
      interface fufu {
          function intFunction() returns(bool);
          function intFunction() returns(uint256);
      }
  
      contract A {
          uint256 public a;
  
          constructor() {
              a = 2;
          }
  
          function functionPublicViewA() returns (uint256) {
              if (freeAa()) return a;
              else return a+1;
          }
  
          function functionPublicPureA() public pure returns (bool) {
              return freeBb();
          }
      }
  
      function freeCc() returns(bool) {
          return true;
      }
  
      contract B {
          uint256 public a;
  
          constructor() {
              a = 2;
          }
  
          function functionPublicViewB() returns (uint256) {
              if (freeAa()) return a;
              else return a+1;
          }
  
          function functionPublicPureB() public pure returns (bool) {
              return freeCc();
          }
      }
      `,
  `
      // SPDX-License-Identifier: MIT
      pragma solidity 0.8.4;
  
      function freeCc() returns(bool) {
          return true;
      }
  
      contract A {
          uint256 public a;
  
          constructor() {
              a = 2;
          }
          
          function functionExternal() returns (uint256) {
              if (freeCc()) return a;
              else return a+1;
          }
  
          function functionPublicViewA() returns (uint256) {
              if (freeCc()) return a;
              else return a+1;
          }
  
          function functionPublicPureA() public pure returns (bool) {
              return freeCc();
          }
      }
      `,
  `
      // SPDX-License-Identifier: MIT
      pragma solidity 0.8.4;
  
      contract A {
          uint256 public a;
  
          constructor() {
              a = 2;
          }
          
          function functionExternal() returns (uint256) {
              if (freeCc()) return a;
              else return a+1;
          }
  
          function functionPublicViewA() returns (uint256) {
              if (freeCc()) return a;
              else return a+1;
          }
  
          function functionPublicPureA() public pure returns (bool) {
              return freeCc();
          }
      }
  
      function freeCc() returns(bool) {
          return true;
      }
      `,
]
