const path = require('path')
const { walkSync } = require('./common/utils')

function looksLikeRule(instance) {
  if (!instance) return false

  if (typeof instance.ruleId !== 'string' || instance.ruleId.length === 0) {
    return false
  }

  if (!instance.meta || typeof instance.meta !== 'object') {
    return false
  }

  if (!instance.meta.docs) {
    return false
  }

  if (!instance.meta.type) {
    return false
  }

  // Your contract: schema must exist (can be null)
  if (!Object.prototype.hasOwnProperty.call(instance.meta, 'schema')) {
    return false
  }

  return true
}

/**
 * Load all rule modules from specified directory
 */
const loadRules = () => {
  const rulesDir = path.join(__dirname, 'rules')
  const rules = []
  const files = walkSync(rulesDir)

  const jsFiles = files.filter((file) => path.extname(file) === '.js')

  for (const file of jsFiles) {
    let FileRule

    try {
      FileRule = require(file)
    } catch {
      continue
    }

    // Must export a constructor
    if (typeof FileRule !== 'function') continue

    let instance
    try {
      instance = new FileRule()
    } catch {
      // Constructor threw → not a rule
      continue
    }

    if (!looksLikeRule(instance)) continue

    rules.push({
      ruleId: instance.ruleId,
      meta: instance.meta,
      file,
    })
  }

  return rules
}

const loadRule = (ruleName) => {
  const rulesDir = path.join(__dirname, 'rules')
  const files = walkSync(rulesDir)

  const jsFiles = files.filter((file) => path.extname(file) === '.js')

  for (const file of jsFiles) {
    const filename = path.parse(file).name
    if (filename !== ruleName) continue

    let FileRule
    try {
      FileRule = require(file)
    } catch {
      return null
    }

    if (typeof FileRule !== 'function') return null

    let instance
    try {
      instance = new FileRule()
    } catch {
      return null
    }

    if (!looksLikeRule(instance)) return null

    return instance
  }

  return null
}

module.exports = {
  loadRules,
  loadRule,
}
