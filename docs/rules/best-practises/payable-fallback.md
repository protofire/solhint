---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "payable-fallback | Solhint"
---

# payable-fallback
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practise%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
When fallback is not payable and there is no receive function you will not be able to receive currency.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "payable-fallback": "warn"
  }
}
```

### Notes
- Solhint allows this rule to automatically fix the code with `--fix` option
- Instead of having a fallback function to receive native currency it is recommended to code a receive() function [[here]](https://docs.soliditylang.org/en/v0.8.24/contracts.html#fallback-function)

## Examples
### 👍 Examples of **correct** code for this rule

#### Fallback is payable

```solidity
function() public payable {}
```

#### Fallback is payable

```solidity
fallback() external payable {}
```

### 👎 Examples of **incorrect** code for this rule

#### Fallback is not payable

```solidity
function() {} function g() payable {}
```

#### Fallback is not payable

```solidity
fallback() {} function g() payable {}
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/tree/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/best-practises/payable-fallback.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/best-practises/payable-fallback.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/best-practises/payable-fallback.js)
