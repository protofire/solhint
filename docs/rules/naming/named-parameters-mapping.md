---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "named-parameters-mapping | Solhint"
---

# named-parameters-mapping
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge off](https://img.shields.io/badge/Default%20Severity-off-undefined)

## Description
Solidity v0.8.18 introduced named parameters on the mappings definition.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to off.

### Example Config
```json
{
  "rules": {
    "named-parameters-mapping": "off"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### To enter "users" mapping the key called "name" is needed to get the "balance"

```solidity
mapping(string name => uint256 balance) public users;
```

#### To enter owner token balance, the main key "owner" enters another mapping which its key is "token" to get its "balance"

```solidity
mapping(address owner => mapping(address token => uint256 balance)) public tokenBalances;
```

#### Main key of mapping is enforced. On nested mappings other naming are not neccesary

```solidity
mapping(address owner => mapping(address => uint256)) public tokenBalances;
```

#### Main key of the parent mapping is enforced. No naming in nested mapping uint256

```solidity
mapping(address owner => mapping(address token => uint256)) public tokenBalances;
```

#### Main key of the parent mapping is enforced. No naming in nested mapping address

```solidity
mapping(address owner => mapping(address => uint256 balance)) public tokenBalances;
```

### 👎 Examples of **incorrect** code for this rule

#### No naming at all in regular mapping 

```solidity
mapping(address => uint256)) public tokenBalances;
```

#### Missing any variable name in regular mapping uint256

```solidity
mapping(address token => uint256)) public tokenBalances;
```

#### Missing any variable name in regular mapping address

```solidity
mapping(address => uint256 balance)) public tokenBalances;
```

#### No MAIN KEY naming in nested mapping. Other naming are not enforced

```solidity
mapping(address => mapping(address token => uint256 balance)) public tokenBalances;
```

## Version
This rule was introduced in [Solhint 3.4.0](https://github.com/protofire/solhint/tree/v3.4.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/named-parameters-mapping.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/named-parameters-mapping.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/named-parameters-mapping.js)
