const path = require('path')
const assert = require('assert')
const { applyExtends } = require('../../lib/config/config-file')
const { resolveShareableConfigName } = require('../../lib/config/config-file')

describe('applyExtends', () => {
  it('should return the same config if the extends property does not exist', () => {
    const initialConfig = {
      rules: {
        rule0: 'error',
      },
    }
    const result = applyExtends(initialConfig)

    assert.deepStrictEqual(result, initialConfig)
  })

  it('should use the given config if the extends array is empty', () => {
    const initialConfig = {
      extends: [],
      rules: {
        rule0: 'error',
      },
    }
    const result = applyExtends(initialConfig)

    assert.deepStrictEqual(result, initialConfig)
  })

  it('should add the rules in the config', () => {
    const initialConfig = {
      extends: ['config1'],
      rules: {
        rule0: 'error',
      },
    }
    const config1 = {
      rules: {
        rule1: 'warning',
      },
    }
    const result = applyExtends(initialConfig, (configName) => ({ config1 })[configName])

    assert.deepStrictEqual(result, {
      extends: ['config1'],
      rules: {
        rule0: 'error',
        rule1: 'warning',
      },
    })
  })

  it('should accept a string as the value of extends', () => {
    const initialConfig = {
      extends: 'config1',
      rules: {
        rule0: 'error',
      },
    }
    const config1 = {
      rules: {
        rule1: 'warning',
      },
    }
    const result = applyExtends(initialConfig, (configName) => ({ config1 })[configName])

    assert.deepStrictEqual(result, {
      extends: ['config1'],
      rules: {
        rule0: 'error',
        rule1: 'warning',
      },
    })
  })

  it('should give higher priority to later configs', () => {
    const initialConfig = {
      extends: ['config1', 'config2'],
      rules: {
        rule0: 'error',
      },
    }
    const config1 = {
      rules: {
        rule1: 'warning',
      },
    }
    const config2 = {
      rules: {
        rule1: 'off',
      },
    }
    const result = applyExtends(initialConfig, (configName) => ({ config1, config2 })[configName])

    assert.deepStrictEqual(result, {
      extends: ['config1', 'config2'],
      rules: {
        rule0: 'error',
        rule1: 'off',
      },
    })
  })

  it('should give higher priority to rules in the config file', () => {
    const initialConfig = {
      extends: ['config1', 'config2'],
      rules: {
        rule0: 'error',
      },
    }
    const config1 = {
      rules: {
        rule0: 'warning',
      },
    }
    const config2 = {
      rules: {
        rule0: 'off',
      },
    }
    const result = applyExtends(initialConfig, (configName) => ({ config1, config2 })[configName])

    assert.deepStrictEqual(result, {
      extends: ['config1', 'config2'],
      rules: {
        rule0: 'error',
      },
    })
  })

  describe('resolveShareableConfigName', () => {
    it('keeps solhint: core presets as-is', () => {
      assert.equal(resolveShareableConfigName('solhint:recommended'), 'solhint:recommended')
      assert.equal(resolveShareableConfigName('solhint:all'), 'solhint:all')
    })

    it('keeps absolute paths as-is (posix)', () => {
      const abs = path.resolve('/tmp/some-config.js')
      assert.equal(resolveShareableConfigName(abs), abs)
    })

    it('keeps absolute paths as-is (windows style) - only if running on win', () => {
      // This avoids failing on non-win where path.isAbsolute('C:\\x') may behave differently
      if (process.platform !== 'win32') return
      const abs = 'C:\\temp\\some-config.js'
      assert.equal(resolveShareableConfigName(abs), abs)
    })

    it('prefixes legacy unscoped configs (foo -> solhint-config-foo)', () => {
      assert.equal(resolveShareableConfigName('foo'), 'solhint-config-foo')
    })

    it('does NOT double-prefix explicit unscoped packages (solhint-config-foo stays)', () => {
      assert.equal(resolveShareableConfigName('solhint-config-foo'), 'solhint-config-foo')
    })

    it('keeps scoped configs that already include solhint-config- prefix', () => {
      assert.equal(
        resolveShareableConfigName('@scope/solhint-config-myconfig'),
        '@scope/solhint-config-myconfig',
      )
    })

    it('maps @scope/foo -> @scope/solhint-config-foo (eslint-style)', () => {
      assert.equal(resolveShareableConfigName('@scope/foo'), '@scope/solhint-config-foo')
    })

    it('does not try to “fix” malformed scoped values (let require fail upstream)', () => {
      assert.equal(resolveShareableConfigName('@scope'), '@scope')
      assert.equal(resolveShareableConfigName('@'), '@')
    })

    it('does not try to support deep scoped paths (leave as-is)', () => {
      // @scope/pkg/extra is not a standard npm package spec for require()
      assert.equal(resolveShareableConfigName('@scope/pkg/extra'), '@scope/pkg/extra')
    })

    it('keeps weird-but-valid unscoped values stable', () => {
      // If someone uses uppercase or dots, we shouldn’t mangle beyond prefixing.
      assert.equal(resolveShareableConfigName('Foo.Bar'), 'solhint-config-Foo.Bar')
    })
  })
})
