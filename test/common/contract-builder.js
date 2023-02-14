const { times } = require('lodash')
const V7_V8_ADDITIONS = require('../helpers/v7-v8-solidity-additions')

function contractWith(code) {
  return `
      pragma solidity 0.4.4;
        
        
      contract A {
        ${code}
      }
    `
}

function libraryWith(code) {
  return `
      pragma solidity 0.4.4;
        
        
      library A {
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

function modifierWith(statements) {
  return contractWith(`
        modifier b() {
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

function stateDef(count) {
  return repeatLines('        uint private a;', count)
}

function constantDef(count) {
  return repeatLines('        uint private constant TEST = 1;', count)
}

function repeatLines(line, count) {
  return times(count)
    .map(() => line)
    .join('\n')
}

function contractWithV7V8Header(code) {
  return `
    ${V7_V8_ADDITIONS}
    ${code}
  }
  `
}

function funcWithV7V8Header(statements) {
  return contractWithV7V8Header(`
        function b() public {
          ${statements}
        }
    `)
}

function modifierWithV7V8Header(statements) {
  return contractWithV7V8Header(`
        modifier b() {
          ${statements}
        }
    `)
}

module.exports = {
  contractWith,
  libraryWith,
  funcWith,
  modifierWith,
  multiLine,
  contractWithPrettier,
  stateDef,
  constantDef,
  repeatLines,
  contractWithV7V8Header,
  funcWithV7V8Header,
  modifierWithV7V8Header,
}
