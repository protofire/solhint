---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "explicit-types | Solhint"
---

# explicit-types
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practices%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Forbid or enforce explicit types (like uint256) that have an alias (like uint).

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | warn          |
| 1     | Options need to be one of "explicit", "implicit"      | explicit      |


### Example Config
```json
{
  "rules": {
    "explicit-types": [
      "warn",
      "explicit"
    ]
  }
}
```

### Notes
- Solhint allows this rule to automatically fix the code with `--fix` option

## Examples
### 👍 Examples of **correct** code for this rule

#### If explicit is selected

```solidity
uint256 public variableName
```

#### If implicit is selected

```solidity
uint public variableName
```

#### If explicit is selected

```solidity
uint256 public variableName = uint256(5)
```

### 👎 Examples of **incorrect** code for this rule

#### If explicit is selected

```solidity
uint public variableName
```

#### If implicit is selected

```solidity
uint256 public variableName
```

#### At any setting

```solidity
uint public variableName = uint256(5)
```

## Version
This rule was introduced in [Solhint 5.0.4](https://github.com/protofire/solhint/blob/v5.0.4)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/explicit-types.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/explicit-types.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/explicit-types.js)
