function contractWith(code) {
  return `
      pragma solidity 0.4.4;
        
        
      contract A {
        ${code}
      }
    `
}

function funcWith(statements) {
  return contractWith(`
      function b() public {
        ${statements}
      }
    `)
}

function multiLine(...args) {
  return args.join('\n')
}

function contractWithPrettier(code) {
  return `pragma solidity 0.4.4;

contract A {
  ${code}
}
`
}

module.exports = { contractWith, funcWith, multiLine, contractWithPrettier }
