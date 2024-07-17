---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "imports-order | Solhint"
---

# imports-order
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Order the imports of the contract to follow a certain hierarchy (read "Notes section")

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "imports-order": "warn"
  }
}
```

### Notes
- Order by hierarchy of directories first, e.g. ./../../ comes before ./../, which comes before ./, which comes before ./foo
- Paths starting with "@" like "@openzeppelin/" and urls ("http" and "https") will go at last
- Order alphabetically for each path at the same level, e.g. ./contract/Zbar.sol comes before ./interface/Ifoo.sol
- Rule does NOT support this kind of import "import * as Alias from "./filename.sol"
- When "--fix",  rule will re-write this notation "../folder/file.sol" or this one "../file.sol" to "./../folder/file.sol" or this one "./../file.sol"

## Examples
This rule does not have examples.

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/imports-order.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/imports-order.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/imports-order.js)
