---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "not-rely-on-time | Solhint"
---

# not-rely-on-time
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Avoid making time-based decisions in your business logic.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "not-rely-on-time": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 1.1.5](https://github.com/protofire/solhint/blob/v1.1.5)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/not-rely-on-time.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/not-rely-on-time.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/not-rely-on-time.js)
