---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "use-forbidden-name | Solhint"
---

# use-forbidden-name
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Avoid to use letters 'I', 'l', 'O' as identifiers.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "use-forbidden-name": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/blob/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/naming/use-forbidden-name.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/naming/use-forbidden-name.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/naming/use-forbidden-name.js)
