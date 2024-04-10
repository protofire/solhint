---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "gas-multitoken1155 | Solhint"
---

# gas-multitoken1155
![Category Badge](https://img.shields.io/badge/-Gas%20Consumption%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
ERC1155 is a cheaper non-fungible token than ERC721

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "gas-multitoken1155": "warn"
  }
}
```

### Notes
- [source](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-8v8t9) of the rule initiative

## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 4.5.0](https://github.com/protofire/solhint/tree/v4.5.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/gas-consumption/gas-multitoken1155.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/gas-consumption/gas-multitoken1155.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/gas-consumption/gas-multitoken1155.js)
