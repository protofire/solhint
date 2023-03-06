---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-console | Solhint"
---

# no-console
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practise%20Rules-informational)
![Default Severity Badge error](https://img.shields.io/badge/Default%20Severity-error-red)
> The {"extends": "solhint:default"} property in a configuration file enables this rule.

> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
No console.log/logInt/logBytesX/logString/etc & No hardhat and forge-std console.sol import statements

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to error.

### Example Config
```json
{
  "rules": {
    "no-console": "error"
  }
}
```


## Examples
### 👎 Examples of **incorrect** code for this rule

#### No console.logX statements

```solidity
console.log('test')
```

#### No hardhat/console.sol import statements

```solidity
import "hardhat/console.sol"
```

#### No forge-std console.sol & console2.sol import statements

```solidity
import "forge-std/consoleN.sol"
```

## Version
This rule was introduced in [Solhint 3.4.0](https://github.com/protofire/solhint/tree/v3.4.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/best-practises/no-console.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/best-practises/no-console.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/best-practises/no-console.js)
