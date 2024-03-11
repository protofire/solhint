---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "gas-length-in-loops | Solhint"
---

# gas-length-in-loops
![Category Badge](https://img.shields.io/badge/-Gas%20Consumption%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Suggest replacing object.length in a loop condition to avoid calculation on each lap

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "gas-length-in-loops": "warn"
  }
}
```

### Notes
- [source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (see Array Length Caching)

## Examples
This rule does not have examples.

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/gas-consumption/gas-length-in-loops.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/gas-consumption/gas-length-in-loops.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/gas-consumption/gas-length-in-loops.js)
