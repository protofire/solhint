---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-console | Solhint"
---

# no-console
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practices%20Rules-informational)
![Default Severity Badge error](https://img.shields.io/badge/Default%20Severity-error-red)
> The {"extends": "solhint:default"} property in a configuration file enables this rule. THIS IS DEPRECATED SINCE VERSION 5.1.0

> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
No console.log/logInt/logBytesX/logString/etc & No hardhat and forge-std console.sol import statements.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to error.

### Example Config
```json
{
  "rules": {
    "no-console": "error"
  }
}
```

### Notes
- Solhint allows this rule to automatically fix the code with `--fix` option

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
This rule was introduced in [Solhint 5.0.4](https://github.com/protofire/solhint/blob/v5.0.4)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/no-console.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/no-console.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/no-console.js)
