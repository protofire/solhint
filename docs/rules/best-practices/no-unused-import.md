---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-unused-import | Solhint"
---

# no-unused-import
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practice%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Imported object name is not being used by the contract.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "no-unused-import": "warn"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Imported object is being used

```solidity

            import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
            contract MyToken is ERC20 {}
          
```

### 👎 Examples of **incorrect** code for this rule

#### Imported object is not being used

```solidity

          import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
            contract B {}
          
```

## Version
This rule was introduced in [Solhint 5.0.4](https://github.com/protofire/solhint/blob/v5.0.4)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/no-unused-import.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/no-unused-import.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/no-unused-import.js)
