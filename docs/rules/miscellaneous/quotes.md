---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "quotes | Solhint"
---

# quotes
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Miscellaneous-informational)
![Default Severity Badge error](https://img.shields.io/badge/Default%20Severity-error-red)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Enforces the use of double or simple quotes as configured for string literals. Values must be 'single' or 'double'.

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | error         |
| 1     | Type of quotes. Must be one of "single", "double"     | double        |


### Example Config
```json
{
  "rules": {
    "quotes": ["error","double"]
  }
}
```

### Notes
- This rule allows to put a double quote inside single quote string and viceversa

## Examples
### 👍 Examples of **correct** code for this rule

#### Configured with double quotes

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        string private a = "test";
      }
    
```

#### Configured with single quotes

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        string private a = 'test';
      }
    
```

#### Configured with double quotes

```solidity
string private constant STR = "You shall 'pass' !";
```

#### Configured with single quotes

```solidity
string private constant STR = 'You shall "pass" !';
```

### 👎 Examples of **incorrect** code for this rule

#### Configured with single quotes

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        string private a = "test";
      }
    
```

#### Configured with double quotes

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        string private a = 'test';
      }
    
```

## Version
This rule was introduced in [Solhint 1.4.0](https://github.com/protofire/solhint/tree/v1.4.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/miscellaneous/quotes.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/miscellaneous/quotes.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/miscellaneous/quotes.js)
