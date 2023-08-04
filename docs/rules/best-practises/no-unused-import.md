---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-unused-import | Solhint"
---

# no-unused-import
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practise%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Imported object name is not being used by the contract.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

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
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/best-practises/no-unused-import.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/best-practises/no-unused-import.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/best-practises/no-unused-import.js)
