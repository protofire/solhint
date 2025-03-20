---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "event-name-camelcase | Solhint"
---

# event-name-camelcase
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Event name must be in CamelCase.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "event-name-camelcase": "warn"
  }
}
```

### Notes
- Solhint allows this rule to automatically fix the code with `--fix` option
- The FIX will only change first letter and remove underscores

## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/blob/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/naming/event-name-camelcase.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/naming/event-name-camelcase.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/naming/event-name-camelcase.js)
