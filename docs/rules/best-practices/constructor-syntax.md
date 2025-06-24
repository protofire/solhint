---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "constructor-syntax | Solhint"
---

# constructor-syntax
![Category Badge](https://img.shields.io/badge/-Best%20Practices%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Constructors should use the new constructor keyword.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "constructor-syntax": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 1.2.0](https://github.com/protofire/solhint/blob/v1.2.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/deprecations/constructor-syntax.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/constructor-syntax.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/deprecations/constructor-syntax.js)
