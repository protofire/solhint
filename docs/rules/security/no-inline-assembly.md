---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-inline-assembly | Solhint"
---

# no-inline-assembly
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Avoid to use inline assembly. It is acceptable only in rare cases.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "no-inline-assembly": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 1.1.6](https://github.com/protofire/solhint/blob/v1.1.6)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/no-inline-assembly.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/no-inline-assembly.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/no-inline-assembly.js)
