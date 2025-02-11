---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "contract-name-pascalcase | Solhint"
---

# contract-name-pascalcase
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Contract, Structs and Enums should be in PascalCase.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "contract-name-pascalcase": "warn"
  }
}
```

### Notes
- Solhint allows this rule to automatically fix the code with `--fix` option
- The FIX will only change first letter and remove underscores

## Examples
This rule does not have examples.

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/naming/contract-name-capwords.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/naming/contract-name-pascalcase.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/naming/contract-name-pascalcase.js)
