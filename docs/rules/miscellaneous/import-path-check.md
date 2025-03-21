---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "import-path-check | Solhint"
---

# import-path-check
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Check if an import file exits in target path

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | warn          |


### Example Config
```json
{
  "rules": {
    "import-path-check": ["warn",{"baseDepPath":"./git/project","deps":["node_modules","lib"]}]
  }
}
```

### Notes
- Rule checks relative and absolute path first. Then checks for each dependency path in config file
- `baseDepPath:` is the base path of the dependencies
- `deps:` is an array of dependency paths to check in specified order
- `baseDepPath` will concatenate with `deps` to check the import path

## Examples
This rule does not have examples.

## Version
This rule was introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/miscellaneous/import-path-check.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/miscellaneous/import-path-check.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/miscellaneous/import-path-check.js)
