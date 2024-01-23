---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "gas-struct-packing | Solhint"
---

# gas-struct-packing
![Category Badge](https://img.shields.io/badge/-Gas%20Consumption%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Suggest to re-arrange struct packing order when it is inefficient

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "gas-struct-packing": "warn"
  }
}
```

### Notes
- This rule 
- [source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (Variable Packing)
- [source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-f8m1r) of the rule initiative

## Examples
This rule does not have examples.

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/gas-consumption/gas-struct-packing.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/gas-consumption/gas-struct-packing.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/gas-consumption/gas-struct-packing.js)
