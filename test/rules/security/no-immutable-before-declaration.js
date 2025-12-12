const { assertNoWarnings, assertWarnsCount, assertErrorMessage } = require('../../common/asserts')
const linter = require('../../../lib/index')
const { contractWith, multiLine } = require('../../common/contract-builder')
const FIXTURE_CODE = require('../../../lib/fixtureCases/security/no-immutable-before-declaration')

describe('Linter - no-immutable-before-declaration', () => {
  it('should report all expected cases in the integration fixture', () => {
    const report = linter.processStr(FIXTURE_CODE, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    // From the fixture expectations:
    //  - immA uses immB (immutable) declared later      -> WARNING
    //  - usesImmLate uses immLate (immutable) later     -> WARNING
    //
    // Everything else (constants, correct order, inherited immutables) -> OK
    assertWarnsCount(report, 2)

    // We don't strictly depend on the exact ordering,
    // but for clarity we check both messages exist.
    // NOTE: assertErrorMessage signature is (report, index, message)
    const msg1 = 'Immutable "immB" is used in the initializer of "immA" before it is declared.'
    const msg2 =
      'Immutable "immLate" is used in the initializer of "usesImmLate" before it is declared.'

    // We just need to ensure both substrings appear somewhere in the report messages.
    const messages = report.messages.map((m) => m.message).join('\n')

    if (!messages.includes(msg1)) {
      throw new Error(`Expected message for immA/immB not found.\nReport:\n${messages}`)
    }
    if (!messages.includes(msg2)) {
      throw new Error(`Expected message for usesImmLate/immLate not found.\nReport:\n${messages}`)
    }
  })

  it('should warn when an immutable is used before its declaration in a simple contract', () => {
    const code = contractWith(`
      uint256 public immA = immB + 100;
      uint256 internal immutable immB = 25;
    `)

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(
      report,
      0,
      'Immutable "immB" is used in the initializer of "immA" before it is declared.'
    )
  })

  it('should not warn when immutable is declared before being used', () => {
    const code = contractWith(`
      uint256 internal immutable immB = 25;
      uint256 public immA = immB + 100;
    `)

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when only constants are referenced before declaration', () => {
    const code = contractWith(`
      uint256 public constA = constB + 100;
      uint256 internal constant constB = 50;
    `)

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should warn when a non-immutable state variable uses an immutable declared later', () => {
    const code = contractWith(`
      uint256 public value = immX + 1;
      uint256 internal immutable immX = 10;
    `)

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(
      report,
      0,
      'Immutable "immX" is used in the initializer of "value" before it is declared.'
    )
  })

  it('should not warn when using inherited immutables from a base contract', () => {
    const code = `
      contract Base {
        uint256 internal immutable baseImm = 42;
      }

      contract Child is Base {
        uint256 public derived = baseImm + 1;
      }
    `

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    // The rule is intentionally scoped to immutables declared in the SAME contract.
    // It should not try to reason about inherited immutables from base contracts.
    assertNoWarnings(report)
  })

  it('should handle multiple state variables and only warn on those actually using later immutables', () => {
    const code = contractWith(
      multiLine(
        'uint256 internal immutable imm1 = 1;',
        'uint256 internal immutable imm2 = 2;',
        'uint256 public a = imm1 + imm2;', // OK: both imm1 and imm2 declared before
        'uint256 public b = imm3 + imm1;', // BAD: imm3 declared later
        'uint256 internal immutable imm3 = 3;'
      )
    )

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(
      report,
      0,
      'Immutable "imm3" is used in the initializer of "b" before it is declared.'
    )
  })

  it('should not warn when immutable is only used in the constructor', () => {
    const code = contractWith(`
    uint256 internal immutable immB;

    constructor() {
      // This assignment is fine and outside the scope of this rule
      // (we only care about state variable initializers).
      immB = 25;
    }
  `)

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should warn when immutable without initializer is used before declaration in another initializer', () => {
    const code = contractWith(`
    uint256 public value = immB + 1;
    uint256 internal immutable immB;

    constructor() {
      immB = 10;
    }
  `)

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(
      report,
      0,
      'Immutable "immB" is used in the initializer of "value" before it is declared.'
    )
  })

  it('should warn only for the immutable used before its declaration, ignoring the correct one', () => {
    const code = contractWith(`
    uint256 internal immutable imm1 = 1;
    uint256 public a = imm1 + 10; // OK

    uint256 public b = imm2 + 10; // BAD: imm2 declared later
    uint256 internal immutable imm2 = 2;

    uint256 public c = imm2 + imm1; // OK: both already declared
  `)

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(
      report,
      0,
      'Immutable "imm2" is used in the initializer of "b" before it is declared.'
    )
  })

  it('should warn when immutable is used via this.immB before its declaration', () => {
    const code = contractWith(`
    uint256 public value = this.immB + 1;
    uint256 internal immutable immB = 10;
  `)

    const report = linter.processStr(code, {
      rules: { 'no-immutable-before-declaration': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(
      report,
      0,
      'Immutable "immB" is used in the initializer of "value" before it is declared.'
    )
  })
})
