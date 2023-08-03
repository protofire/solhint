---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "func-named-parameters | Solhint"
---

# func-named-parameters
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Enforce function calls with Named Parameters when containing more than the configured qty

## Options
This rule accepts an array of options:

| Index | Description                                            | Default Value |
| ----- | ------------------------------------------------------ | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".  | warn          |
| 1     | Maximum qty of unnamed parameters for a function call. | 2             |


### Example Config
```json
{
  "rules": {
    "func-named-parameters": ["warn",2]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Function call with two UNNAMED parameters (default is max 2)

```solidity
functionName('0xA81705c8C247C413a19A244938ae7f4A0393944e', 1e18)
```

#### Function call with two NAMED parameters

```solidity
functionName({ sender: '0xA81705c8C247C413a19A244938ae7f4A0393944e', amount: 1e18})
```

#### Function call with four NAMED parameters

```solidity
functionName({ sender: _senderAddress, amount: 1e18, token: _tokenAddress, receiver: _receiverAddress })
```

### 👎 Examples of **incorrect** code for this rule

#### Function call with four UNNAMED parameters (default is max 2)

```solidity
functionName(_senderAddress, 1e18, _tokenAddress, _receiverAddress )
```

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/func-named-parameters.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/func-named-parameters.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/func-named-parameters.js)
