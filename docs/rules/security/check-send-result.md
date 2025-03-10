---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "check-send-result | Solhint"
---

# check-send-result
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Check result of "send" call.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "check-send-result": "warn"
  }
}
```

### Notes
- Rule will rise false positive on this: `bool success = walletAddress.send(amount); require(success, "Failed to send"); ` 
- Rule will skip ERC777 "send" function to prevent false positives

## Examples
### 👍 Examples of **correct** code for this rule

#### result of "send" call checked with if statement

```solidity
if(x.send(55)) {}
```

#### result of "send" call checked within a require

```solidity
require(payable(walletAddress).send(moneyAmount), "Failed to send moneyAmount");
```

### 👎 Examples of **incorrect** code for this rule

#### result of "send" call ignored

```solidity
x.send(55);
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/blob/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/check-send-result.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/check-send-result.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/check-send-result.js)
