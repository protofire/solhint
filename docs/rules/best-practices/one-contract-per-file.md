---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "one-contract-per-file | Solhint"
---

# one-contract-per-file
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practices%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Enforces the use of ONE Contract per file see [here](https://docs.soliditylang.org/en/v0.8.21/style-guide.html#contract-and-library-names)

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "one-contract-per-file": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 5.0.4](https://github.com/protofire/solhint/blob/v5.0.4)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/one-contract-per-file.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/one-contract-per-file.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/one-contract-per-file.js)
