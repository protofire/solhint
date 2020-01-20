const assert = require('assert')

const applyFixes = require('../../lib/apply-fixes')

describe('applyFixes', () => {
  it('should work when there are no reports', () => {
    const inputSrc = 'contract Foo {}'
    const fixes = []

    const { fixed } = applyFixes(fixes, inputSrc)

    assert.equal(fixed, false)
  })

  it('should work for a single replace', () => {
    const inputSrc = `
contract Foo {
  function foo() {
    throw;
  }
}`.trim()

    const fixes = [
      {
        range: [38, 43],
        text: 'revert()'
      }
    ]

    const { fixed, output } = applyFixes(fixes, inputSrc)

    assert.equal(fixed, true)
    assert.equal(
      output,
      `
contract Foo {
  function foo() {
    revert();
  }
}`.trim()
    )
  })

  it('should work for two fixes', () => {
    const inputSrc = `
contract Foo {
  function foo() {
    throw;
    throw;
  }
}`.trim()

    const fixes = [
      {
        range: [38, 43],
        text: 'revert()'
      },
      {
        range: [49, 54],
        text: 'revert()'
      }
    ]

    const { fixed, output } = applyFixes(fixes, inputSrc)

    assert.equal(fixed, true)
    assert.equal(
      output,
      `
contract Foo {
  function foo() {
    revert();
    revert();
  }
}`.trim()
    )
  })
})
