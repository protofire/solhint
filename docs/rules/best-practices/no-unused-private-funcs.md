---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-unused-private-funcs | Solhint"
---

# no-unused-private-funcs
![Category Badge](https://img.shields.io/badge/-Best%20Practices%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Private function "name" is not being used within its defining contract. Support overloads.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "no-unused-private-funcs": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/no-unused-private-funcs.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/no-unused-private-funcs.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/no-unused-private-funcs.js)
