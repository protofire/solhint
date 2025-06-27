---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "gas-custom-errors | Solhint"
---

# gas-custom-errors
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Gas%20Consumption%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Enforces the use of Custom Errors over Require with strings error and Revert statements

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "gas-custom-errors": "warn"
  }
}
```

### Notes
- This rules applies to Solidity version 0.8.4 and higher

## Examples
### 👍 Examples of **correct** code for this rule

#### Use of Custom Errors

```solidity
revert CustomErrorFunction();
```

#### Use of Custom Errors with arguments

```solidity
revert CustomErrorFunction({ msg: "Insufficient Balance" });
```

#### Use of Require with Custom Error with arguments

```solidity
require(success, CustomErrorFunction({ msg: "Insufficient Balance" }));
```

#### Use of Require with function call and Custom Error

```solidity
require(isAuthorized(account), CustomErrorFunction());
```

#### Use of Require with binary comparison and Custom Error

```solidity
require(a > b, CustomErrorFunction());
```

### 👎 Examples of **incorrect** code for this rule

#### Use of require statement

```solidity
require(userBalance >= availableAmount, "Insufficient Balance");
```

#### Use of plain revert statement

```solidity
revert();
```

#### Use of revert statement with message

```solidity
revert("Insufficient Balance");
```

## Version
This rule was introduced in [Solhint 4.5.0](https://github.com/protofire/solhint/blob/v4.5.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/gas-consumption/gas-custom-errors.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/gas-consumption/gas-custom-errors.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/gas-consumption/gas-custom-errors.js)
