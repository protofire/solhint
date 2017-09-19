

function contractWith(code) {
    return `
      pragma solidity 0.4.4;
        
        
      contract A {
        ${code}
      }
    `;
}

function funcWith(statements) {
    return contractWith(`
      function b() public {
        ${statements}
      }
    `);
}


module.exports = { contractWith, funcWith };