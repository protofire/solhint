---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "reason-string | Solhint"
---

# reason-string
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practices%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Require or revert statement must have a reason string and check that each reason string is at most N characters long.

## Options
This rule accepts an array of options:

| Index | Description                                                                                                 | Default Value    |
| ----- | ----------------------------------------------------------------------------------------------------------- | ---------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                                       | warn             |
| 1     | A JSON object with a single property "maxLength" specifying the max number of characters per reason string. | {"maxLength":32} |


### Example Config
```json
{
  "rules": {
    "reason-string": [
      "warn",
      {
        "maxLength": 32
      }
    ]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Require with reason string

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          require(!has(role, account), "Roles: account already has role");
          role.bearer[account] = true;
          role.bearer[account] = true;
        }
    
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### Require without reason string

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          require(!has(role, account));
          role.bearer[account] = true;
          role.bearer[account] = true;
        }
    
      }
    
```

## Version
This rule was introduced in [Solhint 5.0.4](https://github.com/protofire/solhint/blob/v5.0.4)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/reason-string.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/reason-string.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/reason-string.js)
