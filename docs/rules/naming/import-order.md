---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "import-order | Solhint"
---

# import-order
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Order the imports of the contract to follow a certain hierarchy

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "import-order": "warn"
  }
}
```

### Notes
- Order by hierarchy of directories first, e.g. ../../ comes before ../, which comes before ./, which comes before ./foo
- Order alphabetically for each file at the same level, e.g. ./bar comes before ./foo
- Rule support up to 10 folder levels "../../../../../../../../../../"

## Examples
This rule does not have examples.

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/import-order.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/import-order.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/import-order.js)
