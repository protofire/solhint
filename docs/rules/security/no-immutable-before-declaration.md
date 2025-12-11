---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-immutable-before-declaration | Solhint"
---

# no-immutable-before-declaration
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Immutable variables should not be used in state variable initializers before they are declared.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "no-immutable-before-declaration": "warn"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Immutable declared before being used in another initializer

```solidity

            contract Immutables {
                uint256 internal immutable immB = 25;
                uint256 public immA = immB + 100; // OK, immB is already declared
            }
          
```

#### Constants can be referenced before declaration

```solidity

            contract Immutables {
                uint256 public constA = constB + 100; // OK, constants are compile-time
                uint256 internal constant constB = 50;
            }
          
```

### 👎 Examples of **incorrect** code for this rule

#### Immutable used before declaration in state variable initializer

```solidity

            contract Immutables {
                uint256 public immA = immB + 100; // BAD: immB declared later
                uint256 internal immutable immB = 25;
            }
          
```

## Version
This rule was introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/no-immutable-before-declaration.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/no-immutable-before-declaration.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/no-immutable-before-declaration.js)
