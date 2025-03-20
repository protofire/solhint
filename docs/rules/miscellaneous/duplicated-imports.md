---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "duplicated-imports | Solhint"
---

# duplicated-imports
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Check if an import is done twice in the same file and there is no alias

## Options
This rule accepts a string option for rule severity. Must be one of "error", "warn", "off". Defaults to warn.

### Example Config
```json
{
  "rules": {
    "duplicated-imports": "warn"
  }
}
```

### Notes
- Rule reports "(inline) duplicated" if the same object is imported more than once in the same import statement
- Rule reports "(globalSamePath) duplicated" if the same object is imported on another import statement from same location
- Rule reports "(globalDiffPath) duplicated" if the same object is imported on another import statement, from other location, but no alias
- Rule does NOT support this kind of import "import * as Alias from "./filename.sol"

## Examples
This rule does not have examples.

## Version
This rule was introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/miscellaneous/duplicated-imports.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/miscellaneous/duplicated-imports.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/miscellaneous/duplicated-imports.js)
