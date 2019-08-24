---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "mark-callable-contracts | Solhint"
date:        "Sat, 24 Aug 2019 02:21:24 GMT"
author:      "Peter Chung <touhonoob@gmail.com>"
---

# mark-callable-contracts
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Explicitly mark all external contracts as trusted or untrusted.

## Options
This rule does not have options.

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
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/tree/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/security/mark-callable-contracts.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/security/mark-callable-contracts.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/security/mark-callable-contracts.js)
