---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "explicit-types | Solhint"
---

# explicit-types
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practise%20Rules-informational)
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
    "explicit-types": ["warn","explicit"]
  }
}
```


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
This rule was introduced in [Solhint 3.5.1](https://github.com/protofire/solhint/tree/v3.5.1)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/best-practises/explicit-types.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/best-practises/explicit-types.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/best-practises/explicit-types.js)
