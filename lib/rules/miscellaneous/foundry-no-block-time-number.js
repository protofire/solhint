const path = require('path')
const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const ruleId = 'foundry-no-block-time-number'

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_TEST_DIRS = ['test', 'tests'] // default folders considered as Foundry test roots

const meta = {
  type: 'miscellaneous',

  docs: {
    description:
      'Warn on the use of block.timestamp / block.number inside Foundry test files; recommend vm.getBlockTimestamp() / vm.getBlockNumber().',
    category: 'Miscellaneous',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description:
          'Array of folder names for solhint to execute (defaults to ["test","tests"], case-insensitive).',
        default: JSON.stringify(DEFAULT_TEST_DIRS),
      },
    ],
    notes: [
      {
        note: 'This rule only runs for files located under the configured test directories (e.g., test/** or tests/**).',
      },
    ],
  },

  fixable: false,
  recommended: false,
  // defaultSetup: [severity, testDirs[]]
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_TEST_DIRS],

  schema: {
    type: 'array',
    description: 'Array of folder names for solhint to execute the rule (case-insensitive).',
    items: { type: 'string', errorMessage: 'Each item must be a string' },
  },
}

class FoundryNoBlockTimeNumberChecker extends BaseChecker {
  constructor(reporter, config, fileName) {
    super(reporter, ruleId, meta)

    // Read array of folders from config. If invalid/empty, fallback to defaults.
    const arr = config ? config.getArray(ruleId) : []
    this.testDirs = Array.isArray(arr) && arr.length > 0 ? arr.slice() : DEFAULT_TEST_DIRS.slice()

    this.fileName = fileName
    this.enabledForThisFile = this.isInAnyTestDir(fileName, this.testDirs)
  }

  // Only evaluate the AST if the current file is inside a configured test directory.
  MemberAccess(node) {
    if (!this.enabledForThisFile) return

    // Detect `block.timestamp` / `block.number`
    if (node && node.type === 'MemberAccess') {
      const expr = node.expression
      const member = node.memberName

      if (expr && expr.type === 'Identifier' && expr.name === 'block') {
        if (member === 'timestamp') {
          this.error(
            node,
            'Avoid `block.timestamp` in Foundry tests. Use `vm.getBlockTimestamp()` instead.'
          )
        } else if (member === 'number') {
          this.error(
            node,
            'Avoid `block.number` in Foundry tests. Use `vm.getBlockNumber()` instead.'
          )
        }
      }
    }
  }

  // ---------- helpers ----------
  isInAnyTestDir(fileName, testDirs) {
    try {
      // Make the path relative to the project root to compare path segments
      const rel = path.relative(process.cwd(), fileName)
      const norm = path.normalize(rel) // normalize separators for Win/Linux
      const segments = norm.split(path.sep).map((s) => s.toLowerCase())

      // Match by exact directory segment (case-insensitive)
      const wanted = new Set(testDirs.map((d) => String(d).toLowerCase()))
      return segments.some((seg) => wanted.has(seg))
    } catch (_) {
      // Fail-safe: if anything goes wrong, do not enable the rule for this file.
      return false
    }
  }
}

module.exports = FoundryNoBlockTimeNumberChecker
