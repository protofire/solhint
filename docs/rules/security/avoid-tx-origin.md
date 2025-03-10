---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "avoid-tx-origin | Solhint"
---

# avoid-tx-origin
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Avoid to use tx.origin.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "avoid-tx-origin": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 1.1.5](https://github.com/protofire/solhint/blob/v1.1.5)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/avoid-tx-origin.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/avoid-tx-origin.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/avoid-tx-origin.js)
