---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "gas-calldata-parameters | Solhint"
---

# gas-calldata-parameters
![Category Badge](https://img.shields.io/badge/-Gas%20Consumption%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Suggest calldata keyword on function arguments when read only

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "gas-calldata-parameters": "warn"
  }
}
```

### Notes
- Only applies for external functions when receiving arguments with [memory] keyword
- This rule makes a soft check to see if argument is readOnly to make the suggestion. Check it manually before changing it.
- [source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (see Calldata vs Memory)
- [source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-6acr7) of the rule initiative

## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 4.5.0](https://github.com/protofire/solhint/tree/v4.5.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/gas-consumption/gas-calldata-parameters.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/gas-consumption/gas-calldata-parameters.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/gas-consumption/gas-calldata-parameters.js)
