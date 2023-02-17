---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "not-rely-on-time | Solhint"
---

# not-rely-on-time
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge off](https://img.shields.io/badge/Default%20Severity-off-undefined)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.

## Description
Avoid making time-based decisions in your business logic.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to off.

### Example Config
```json
{
  "rules": {
    "not-rely-on-time": "off"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 1.1.5](https://github.com/protofire/solhint/tree/v1.1.5)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/security/not-rely-on-time.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/security/not-rely-on-time.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/security/not-rely-on-time.js)
