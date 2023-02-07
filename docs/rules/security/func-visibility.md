---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "func-visibility | Solhint"
---

# func-visibility
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Explicitly mark visibility in function.

## Options
This rule accepts an array of options:

| Index | Description                                                                                                                                                                                    | Default Value                |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                                                                                                                          | warn                         |
| 1     | A JSON object with a single property "ignoreConstructors" specifying if the rule should ignore constructors. (**Note: This is required to be true for Solidity >=0.7.0 and false for <0.7.0**) | {"ignoreConstructors":false} |


### Example Config
```json
{
  "rules": {
    "func-visibility": ["warn",{"ignoreConstructors":false}]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Functions explicitly marked with visibility

```solidity
function b() internal { }
function b() external { }
function b() private { }
function b() public { }
constructor() public { }
```

### 👎 Examples of **incorrect** code for this rule

#### Functions without explicitly marked visibility

```solidity
function b() { }
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/tree/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/security/func-visibility.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/security/func-visibility.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/security/func-visibility.js)
