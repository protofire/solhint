---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-empty-blocks | Solhint"
---

# no-empty-blocks
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practice%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Code block has zero statements inside. Exceptions apply.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "no-empty-blocks": "warn"
  }
}
```

### Notes
- The rule ignores an empty constructor by default as long as base contracts are being inherited. See "Empty Constructor" example.

## Examples
### 👍 Examples of **correct** code for this rule

#### Empty fallback function

```solidity
fallback () external { }
```

#### Empty constructor with member initialization list

```solidity
constructor(uint param) Foo(param) Bar(param*2) { }
```

### 👎 Examples of **incorrect** code for this rule

#### Empty block on if statement

```solidity
if (condition) { }
```

#### Empty contract

```solidity
contract Foo { }
```

#### Empty block in constructor without parent initialization

```solidity
constructor () { }
```

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/no-empty-blocks.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/no-empty-blocks.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/no-empty-blocks.js)
