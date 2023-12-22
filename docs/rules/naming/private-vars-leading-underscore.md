---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "private-vars-leading-underscore | Solhint"
---

# private-vars-leading-underscore
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Non-external functions and state variables should start with a single underscore. Others, shouldn't

## Options
This rule accepts an array of options:

| Index | Description                                                                                                                               | Default Value    |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                                                                     | warn             |
| 1     | A JSON object with a single property "strict" specifying if the rule should apply to ALL non state variables. Default: { strict: false }. | {"strict":false} |


### Example Config
```json
{
  "rules": {
    "private-vars-leading-underscore": ["warn",{"strict":false}]
  }
}
```

### Notes
- This rule DO NOT considers functions and variables in Libraries
- This rule skips external and public functions
- This rule skips external and public state variables
- See [here](https://docs.soliditylang.org/en/latest/style-guide.html#underscore-prefix-for-non-external-functions-and-variables) for further information
- Solhint allows this rule to automatically fix the code with `--fix` option

## Examples
### 👍 Examples of **correct** code for this rule

#### Internal function with correct naming

```solidity
function _thisIsInternal() internal {}
```

#### Private function with correct naming

```solidity
function _thisIsPrivate() private {}
```

#### Internal state variable with correct naming

```solidity
uint256 internal _thisIsInternalVariable;
```

#### Internal state variable with correct naming (no visibility is considered internal)

```solidity
uint256 _thisIsInternalVariable;
```

### 👎 Examples of **incorrect** code for this rule

#### Internal function with incorrect naming

```solidity
function thisIsInternal() internal {}
```

#### Private function with incorrect naming

```solidity
function thisIsPrivate() private {}
```

#### Internal state variable with incorrect naming

```solidity
uint256 internal thisIsInternalVariable;
```

#### Internal state variable with incorrect naming (no visibility is considered internal)

```solidity
uint256 thisIsInternalVariable;
```

## Version
This rule was introduced in [Solhint 3.0.0-rc.3](https://github.com/protofire/solhint/tree/v3.0.0-rc.3)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/private-vars-leading-underscore.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/private-vars-leading-underscore.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/private-vars-leading-underscore.js)
