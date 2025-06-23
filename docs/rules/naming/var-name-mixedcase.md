---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "var-name-mixedcase | Solhint"
---

# var-name-mixedcase
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Variable names must be in mixedCase. (Does not check IMMUTABLES nor CONSTANTS (use inherent rules for that)

## Options
This rule accepts an array of options:

| Index | Description                                                                                                                                                        | Default Value                  |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                                                                                              | warn                           |
| 1     | A JSON object with a single property "prefixForImmutables" specifying the prefix to put to consider a variable as kind of immutable to allow it to be in all CAPS. | {"prefixForImmutables":"IMM_"} |


### Example Config
```json
{
  "rules": {
    "var-name-mixedcase": ["warn",{"prefixForImmutables":"IMM_"}]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### If config is { prefixForImmutables: "RST_" } and variable is prefixed with that prefix

```solidity
string public RST_VARIABLE_NAME
```

#### If no config is provided and variable is prefixed with default

```solidity
string public IMM_VARIABLE_NAME
```

### 👎 Examples of **incorrect** code for this rule

#### If no config is selected and "error" is defined in rule

```solidity
string public VARIABLE_NAME
```

#### If config is { prefixForImmutables: "RST_" } and variable is not prefixed

```solidity
string public VARIABLE_NAME
```

#### If config is { prefixForImmutables: "RST_" } and variable is prefixed with another prefix

```solidity
string public IMM_VARIABLE_NAME
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/blob/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/naming/var-name-mixedcase.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/naming/var-name-mixedcase.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/naming/var-name-mixedcase.js)
