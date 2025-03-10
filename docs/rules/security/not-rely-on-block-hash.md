---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "not-rely-on-block-hash | Solhint"
---

# not-rely-on-block-hash
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Do not rely on "block.blockhash". Miners can influence its value.

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "not-rely-on-block-hash": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 1.1.6](https://github.com/protofire/solhint/blob/v1.1.6)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/not-rely-on-block-hash.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/not-rely-on-block-hash.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/not-rely-on-block-hash.js)
