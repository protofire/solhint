---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "gas-increment-by-one | Solhint"
---

# gas-increment-by-one
![Category Badge](https://img.shields.io/badge/-Gas%20Consumption%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Suggest incrementation by one like this ++i instead of other type

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "gas-increment-by-one": "warn"
  }
}
```

### Notes
- This rule only works for expressions like this: [ j = j + 1 ] but will fail is the code is written like this: [ j = 1 + j ]
- [source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (Incrementing/Decrementing By 1)
- [source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-8rekj) of the rule initiative

## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 4.5.0](https://github.com/protofire/solhint/tree/v4.5.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/gas-consumption/gas-increment-by-one.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/gas-consumption/gas-increment-by-one.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/gas-consumption/gas-increment-by-one.js)
