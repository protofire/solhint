---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "immutable-vars-naming | Solhint"
---

# immutable-vars-naming
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Check Immutable variables. Capitalized SNAKE_CASE or mixedCase depending on configuration.

## Options
This rule accepts an array of options:

| Index | Description                                                                                                                              | Default Value                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                                                                    | warn                           |
| 1     | A JSON object with a single property "immutablesAsConstants" as boolean specifying if immutable variables should be treated as constants | {"immutablesAsConstants":true} |


### Example Config
```json
{
  "rules": {
    "immutable-vars-naming": ["warn",{"immutablesAsConstants":true}]
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 3.5.1](https://github.com/protofire/solhint/tree/v3.5.1)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/immutable-vars-naming.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/immutable-vars-naming.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/immutable-vars-naming.js)
