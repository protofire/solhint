const assert = require('assert')
const _ = require('lodash')
const { loadRule, loadRules } = require('../../lib/load-rules')

describe('Load Rules', () => {
  it('should load all rules', () => {
    const rules = loadRules()

    for (const rule of rules) {
      assert.equal(typeof rule, 'object')
      assert.equal(_.has(rule, 'meta'), true)
      assert.equal(_.has(rule, 'ruleId'), true)
      assert.equal(_.has(rule.meta, 'type'), true)
      assert.equal(_.has(rule.meta, 'docs'), true)
      assert.equal(_.has(rule.meta, 'recommended'), true)
      assert.equal(_.has(rule.meta, 'defaultSetup'), true)
      assert.equal(_.has(rule.meta, 'schema'), true)
    }
  })

  it('should load all rules (and never return undefined)', () => {
    const rules = loadRules()
    assert.ok(Array.isArray(rules), 'loadRules() must return an array')
    assert.ok(rules.length > 0, 'should load at least one rule')
  })

  it('each loaded rule must include schema key (null or object)', () => {
    const rules = loadRules()

    for (const rule of rules) {
      assert.equal(typeof rule, 'object')
      assert.ok(rule.ruleId, 'ruleId must exist')
      assert.ok(rule.meta, 'meta must exist')
      assert.ok(rule.meta.docs, 'meta.docs must exist')

      // Your contract: schema must exist (can be null)
      assert.ok(
        Object.prototype.hasOwnProperty.call(rule.meta, 'schema'),
        `Rule '${rule.ruleId}' meta must define "schema" key (null or object)`
      )

      // Optional: enforce only null or object (not number/string)
      const s = rule.meta.schema
      assert.ok(
        s === null || (typeof s === 'object' && !Array.isArray(s)),
        `Rule '${rule.ruleId}' meta.schema must be null or an object`
      )
    }
  })

  it('should load a single rule', () => {
    const rule = loadRule('no-console')

    assert.equal(typeof rule, 'object')
    assert.equal(_.has(rule, 'meta'), true)
    assert.equal(_.has(rule, 'ruleId'), true)
    assert.equal(_.has(rule.meta, 'type'), true)
    assert.equal(_.has(rule.meta, 'docs'), true)
    assert.equal(_.has(rule.meta, 'recommended'), true)
    assert.equal(_.has(rule.meta, 'defaultSetup'), true)
    assert.equal(_.has(rule.meta, 'schema'), true)
  })

  it('should not load a single rule', () => {
    const rule = loadRule('foo')
    assert.ok(!rule)
  })

  it('should ignore non-rule function exports (factories/helpers)', () => {
    const rules = loadRules()

    // make sure that nothing weird got in:
    // there should not be a "ruleId" equal to the helper file name
    const ruleIds = new Set(rules.map((r) => r.ruleId))

    // typical examples:
    assert.ok(!ruleIds.has('base-checker'), 'base-checker must not be treated as a rule')
    assert.ok(
      !ruleIds.has('rule-config-validator'),
      'rule-config-validator must not be treated as a rule'
    )
  })

  it('should load only real rules (helpers must be ignored)', () => {
    const rules = loadRules()
    const ruleIds = rules.map((r) => r.ruleId)

    assert.ok(ruleIds.length > 0)

    // Helpers / infra must never appear
    assert.ok(!ruleIds.includes('base-checker'))
    assert.ok(!ruleIds.includes('rule-config-validator'))
  })
})
