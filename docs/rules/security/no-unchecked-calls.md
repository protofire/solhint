---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-unchecked-calls | Solhint"
---

# no-unchecked-calls
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Check return value of low-level calls (call, staticcall, delegatecall).

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "no-unchecked-calls": "warn"
  }
}
```

### Notes
- Unlike avoid-low-level-calls, this rule allows low-level calls but requires their return value to be checked.

## Examples
### 👍 Examples of **correct** code for this rule

#### Return value of low-level call checked with tuple assignment

```solidity
(bool success, ) = addr.call(data);
(bool success, bytes memory result) = addr.call(data);
if(addr.call(data)) {}
require(addr.call(data));
assert(addr.call(data));
```

### 👎 Examples of **incorrect** code for this rule

#### Return value of low-level call ignored

```solidity
addr.call(data);
addr.staticcall(data);
addr.delegatecall(data);
addr.call{value: 1 ether}("");
addr.call.value(1)();
```

## Version
This rule was introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/no-unchecked-calls.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/no-unchecked-calls.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/no-unchecked-calls.js)
