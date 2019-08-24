<!---
This is a dynamically generated file. Do not edit manually.
date:        Sat, 24 Aug 2019 01:45:04 GMT
author:      "Peter Chung <touhonoob@gmail.com>"
--->

# space-after-comma
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Comma must be separated from next element by space.

## Options
This rule does not have options.

## Examples
### 👍 Examples of **correct** code for this rule

#### Expression with correct comma align

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          var (a, b,) = test1.test2(); a + b;
        }
    
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### Expression with incorrect comma align

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          var (a,b) = test1.test2(); a + b;
        }
    
      }
    
```

## Version
This rule was introduced in [Solhint 1.1.5](https://github.com/protofire/solhint/tree/v1.1.5)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/align/space-after-comma.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/align/space-after-comma.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/align/space-after-comma.js)
