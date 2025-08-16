const { expect } = require('chai')
const { stripVTControlCharacters } = require('node:util')
const stripAnsi = require('strip-ansi')

describe('strip control characters', () => {
  const sample = '\u001b[31mred\u001b[39m normal'
  it('built-in util.stripVTControlCharacters matches strip-ansi', () => {
    expect(stripVTControlCharacters(sample)).to.equal(stripAnsi(sample))
  })
})
