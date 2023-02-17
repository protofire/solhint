---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "named-parameters-mapping | Solhint"
---

# named-parameters-mapping
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge off](https://img.shields.io/badge/Default%20Severity-off-undefined)

## Description
Solidity v0.8.18 introduced named parameters on the mappings definition

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

### 👎 Examples of **incorrect** code for this rule

#### No naming in regular mapping 

```solidity
mapping(address => uint256)) public tokenBalances;
```

#### No naming in nested mapping 

```solidity
mapping(address => mapping(address => uint256)) public tokenBalances;
```

#### No complete naming in nested mapping. Missing main key and value 

```solidity
mapping(address => mapping(address token => uint256)) public tokenBalances;
```

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/named-parameters-mapping.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/named-parameters-mapping.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/named-parameters-mapping.js)
