const { expect } = require('chai')
const { getFileHash, shouldLint, updateCacheEntry } = require('../../lib/cache/cache-manager')

describe('cache manager', () => {
  const file = 'Foo.sol'
  const code = 'contract foo {}'
  const rules = { 'contract-name-capwords': 'warn' }

  it('should re-lint when fix mode is enabled after a non-fix run', () => {
    const cache = {}
    updateCacheEntry(file, code, { rules }, cache)

    expect(shouldLint(file, code, { rules, fix: true }, cache)).to.equal(true)
  })

  it('should re-lint when fix mode is disabled after a fix run', () => {
    const cache = {}
    updateCacheEntry(file, code, { rules, fix: true }, cache)

    expect(shouldLint(file, code, { rules, fix: false }, cache)).to.equal(true)
  })

  it('should reuse the cache when fix mode stays enabled', () => {
    const cache = {}
    updateCacheEntry(file, code, { rules, fix: true }, cache)

    expect(shouldLint(file, code, { rules, fix: true }, cache)).to.equal(false)
  })

  it('should treat omitted and false fix options as the same mode', () => {
    const cache = {}
    updateCacheEntry(file, code, { rules }, cache)

    expect(shouldLint(file, code, { rules, fix: false }, cache)).to.equal(false)
  })

  it('should not reuse legacy rules-only cache entries for a fix run', () => {
    const cache = { [`${file}::${getFileHash(JSON.stringify(rules))}`]: getFileHash(code) }

    expect(shouldLint(file, code, { rules, fix: true }, cache)).to.equal(true)
  })
})
