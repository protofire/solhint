---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "compiler-version | Solhint"
---

# compiler-version
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge error](https://img.shields.io/badge/Default%20Severity-error-red)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Compiler version must satisfy a semver requirement.

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | error         |
| 1     | Semver requirement                                    | ^0.8.24       |


### Example Config
```json
{
  "rules": {
    "compiler-version": ["error","^0.8.24"]
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 2.1.0](https://github.com/protofire/solhint/blob/v2.1.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/security/compiler-version.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/security/compiler-version.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/security/compiler-version.js)
