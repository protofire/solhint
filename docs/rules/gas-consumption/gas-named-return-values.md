---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "gas-named-return-values | Solhint"
---

# gas-named-return-values
![Category Badge](https://img.shields.io/badge/-Gas%20Consumption%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Enforce the return values of a function to be named

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "gas-named-return-values": "warn"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Function definition with named return values

```solidity
function checkBalance(address wallet) external view returns(uint256 retBalance) {}
```

### 👎 Examples of **incorrect** code for this rule

#### Function definition with UNNAMED return values

```solidity
function checkBalance(address wallet) external view returns(uint256) {}
```

## Version
This rule was introduced in [Solhint 4.5.0](https://github.com/protofire/solhint/blob/v4.5.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/gas-consumption/gas-named-return-values.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/gas-consumption/gas-named-return-values.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/gas-consumption/gas-named-return-values.js)
