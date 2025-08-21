---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-unused-vars | Solhint"
---

# no-unused-vars
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practices%20Rules-informational)
![Default Severity Badge error](https://img.shields.io/badge/Default%20Severity-error-red)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Variable "name" is unused.

## Options
This rule accepts an array of options:

| Index | Description                                                                                                                                       | Default Value               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                                                                             | error                       |
| 1     | A JSON object with a single property "validateParameters" as boolean specifying whether to report unused parameters from functions and modifiers. | {"validateParameters":true} |


### Example Config
```json
{
  "rules": {
    "no-unused-vars": [
      "error",
      {
        "validateParameters": true
      }
    ]
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 5.0.4](https://github.com/protofire/solhint/blob/v5.0.4)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/no-unused-vars.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/no-unused-vars.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/no-unused-vars.js)
