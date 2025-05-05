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
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

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
This rule was introduced in [Solhint 4.5.0](https://github.com/protofire/solhint/blob/v4.5.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/gas-consumption/gas-length-in-loops.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/gas-consumption/gas-length-in-loops.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/gas-consumption/gas-length-in-loops.js)
