---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "avoid-throw | Solhint"
---

# avoid-throw
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
"throw" is deprecated, avoid to use it.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "avoid-throw": "warn"
  }
}
```

### Notes
- Solhint allows this rule to automatically fix the code with `--fix` option

## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/blob/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/avoid-throw.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/avoid-throw.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/avoid-throw.js)
