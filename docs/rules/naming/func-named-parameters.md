---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "func-named-parameters | Solhint"
---

# func-named-parameters
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Enforce named parameters for function calls with 4 or more arguments. This rule may have some false positives

## Options
This rule accepts an array of options:

| Index | Description                                                                                              | Default Value |
| ----- | -------------------------------------------------------------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                                    | warn          |
| 1     | Minimum qty of unnamed parameters for a function call (to prevent false positives on builtin functions). | 4             |


### Example Config
```json
{
  "rules": {
    "func-named-parameters": ["warn",4]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Function call with two UNNAMED parameters (default is 4)

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

#### abi.encodeX call with four UNNAMED parameters

```solidity
abi.encodePacked(_senderAddress, 1e18, _tokenAddress, _receiverAddress )
```

### 👎 Examples of **incorrect** code for this rule

#### Function call with four UNNAMED parameters (default 4)

```solidity
functionName(_senderAddress, 1e18, _tokenAddress, _receiverAddress )
```

## Version
This rule was introduced in [Solhint 3.5.1](https://github.com/protofire/solhint/tree/v3.5.1)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/func-named-parameters.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/func-named-parameters.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/func-named-parameters.js)
