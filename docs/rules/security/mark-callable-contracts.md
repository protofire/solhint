---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "mark-callable-contracts | Solhint"
---

# mark-callable-contracts
![Deprecated Badge](https://img.shields.io/badge/-Deprecated-yellow)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> This rule is **deprecated**


## Description
Explicitly mark all external contracts as trusted or untrusted.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "mark-callable-contracts": "warn"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### External contract name with "Trusted" prefix

```solidity
TrustedBank.withdraw(100);
```

### 👎 Examples of **incorrect** code for this rule

#### External contract name without "Trusted" prefix

```solidity
Bank.withdraw(100);
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/blob/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/mark-callable-contracts.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/mark-callable-contracts.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/mark-callable-contracts.js)
