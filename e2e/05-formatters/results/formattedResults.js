const formattedResults = {
  stylish: `contracts/AccessControlTest.sol
Error:    2:1   error    Compiler version ^0.8.19 does not satisfy the ^0.5.8 semver requirement                            compiler-version
Warning:    5:5   warning  Variable name must be in mixedCase                                                                 var-name-mixedcase
Warning:    7:5   warning  Explicitly mark visibility in function (Set ignoreConstructors to true if using solidity >=0.7.0)  func-visibility
Warning:    7:19  warning  Code contains empty blocks                                                                         no-empty-blocks
Warning:    9:5   warning  All public or external methods in a contract must override a definition from an interface          comprehensive-interface
Warning:   11:9   warning  Use "keccak256" instead of deprecated "sha3"                                                       avoid-sha3
Warning:   12:9   warning  "throw" is deprecated, avoid to use it                                                             avoid-throw

✖ 7 problems (1 error, 6 warnings)`,

  tableFrom: `contracts/AccessControlTest.sol

║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║
╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢
║ 2        │ 1        │ error    │ Compiler version ^0.8.19 does not satisfy the          │ compiler-version     ║
║          │          │          │ ^0.5.8 semver requirement                              │                      ║
║ 5        │ 5        │ warning  │ Variable name must be in mixedCase                     │ var-name-mixedcase   ║
║ 7        │ 5        │ warning  │ Explicitly mark visibility in function (Set            │ func-visibility      ║
║          │          │          │ ignoreConstructors to true if using solidity           │                      ║
║          │          │          │ >=0.7.0)                                               │                      ║
║ 7        │ 19       │ warning  │ Code contains empty blocks                             │ no-empty-blocks      ║
║ 9        │ 5        │ warning  │ All public or external methods in a contract must      │ comprehensive-       ║
║          │          │          │ override a definition from an interface                │ interface            ║
║ 11       │ 9        │ warning  │ Use "keccak256" instead of deprecated "sha3"           │ avoid-sha3           ║
║ 12       │ 9        │ warning  │ "throw" is deprecated, avoid to use it                 │ avoid-throw          ║

╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ 1 Error                                                                                                        ║
╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ 6 Warnings                                                                                                     ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝`,

  tapFrom: `TAP version 13
1..1
not ok 1 - contracts/AccessControlTest.sol
  ---
  message: Compiler version ^0.8.19 does not satisfy the ^0.5.8 semver requirement
  severity: error
  data:
    line: 2
    column: 1
    ruleId: compiler-version
  messages:
    - message: Variable name must be in mixedCase
      severity: warning
      data:
        line: 5
        column: 5
        ruleId: var-name-mixedcase
    - message: >-
        Explicitly mark visibility in function (Set ignoreConstructors to true if
        using solidity >=0.7.0)
      severity: warning
      data:
        line: 7
        column: 5
        ruleId: func-visibility
    - message: Code contains empty blocks
      severity: warning
      data:
        line: 7
        column: 19
        ruleId: no-empty-blocks
    - message: >-
        All public or external methods in a contract must override a definition
        from an interface
      severity: warning
      data:
        line: 9
        column: 5
        ruleId: comprehensive-interface
    - message: Use "keccak256" instead of deprecated "sha3"
      severity: warning
      data:
        line: 11
        column: 9
        ruleId: avoid-sha3
    - message: '"throw" is deprecated, avoid to use it'
      severity: warning
      data:
        line: 12
        column: 9
        ruleId: avoid-throw
  ...`,

  unixForm: `contracts/AccessControlTest.sol:2:1: Compiler version ^0.8.19 does not satisfy the ^0.5.8 semver requirement [Error/compiler-version]
contracts/AccessControlTest.sol:5:5: Variable name must be in mixedCase [Warning/var-name-mixedcase]
contracts/AccessControlTest.sol:7:5: Explicitly mark visibility in function (Set ignoreConstructors to true if using solidity >=0.7.0) [Warning/func-visibility]
contracts/AccessControlTest.sol:7:19: Code contains empty blocks [Warning/no-empty-blocks]
contracts/AccessControlTest.sol:9:5: All public or external methods in a contract must override a definition from an interface [Warning/comprehensive-interface]
contracts/AccessControlTest.sol:11:9: Use "keccak256" instead of deprecated "sha3" [Warning/avoid-sha3]
contracts/AccessControlTest.sol:12:9: "throw" is deprecated, avoid to use it [Warning/avoid-throw]

7 problems`,

  jsonForm: `[
  {
    line: 2,
    column: 1,
    severity: 'Error',
    message: 'Compiler version ^0.8.19 does not satisfy the ^0.5.8 semver requirement',
    ruleId: 'compiler-version',
    fix: null,
    filePath: 'contracts/AccessControlTest.sol'
  },
  {
    line: 5,
    column: 5,
    severity: 'Warning',
    message: 'Variable name must be in mixedCase',
    ruleId: 'var-name-mixedcase',
    fix: null,
    filePath: 'contracts/AccessControlTest.sol'
  },
  {
    line: 7,
    column: 5,
    severity: 'Warning',
    message: 'Explicitly mark visibility in function (Set ignoreConstructors to true if using solidity >=0.7.0)',
    ruleId: 'func-visibility',
    fix: null,
    filePath: 'contracts/AccessControlTest.sol'
  },
  {
    line: 7,
    column: 19,
    severity: 'Warning',
    message: 'Code contains empty blocks',
    ruleId: 'no-empty-blocks',
    fix: null,
    filePath: 'contracts/AccessControlTest.sol'
  },
  {
    line: 9,
    column: 5,
    severity: 'Warning',
    message: 'All public or external methods in a contract must override a definition from an interface',
    ruleId: 'comprehensive-interface',
    fix: null,
    filePath: 'contracts/AccessControlTest.sol'
  },
  {
    line: 11,
    column: 9,
    severity: 'Warning',
    message: 'Use "keccak256" instead of deprecated "sha3"',
    ruleId: 'avoid-sha3',
    filePath: 'contracts/AccessControlTest.sol'
  },
  {
    line: 12,
    column: 9,
    severity: 'Warning',
    message: '"throw" is deprecated, avoid to use it',
    ruleId: 'avoid-throw',
    filePath: 'contracts/AccessControlTest.sol'
  }
]`,
}

module.exports = formattedResults
