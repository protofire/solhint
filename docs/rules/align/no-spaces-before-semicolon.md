---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-spaces-before-semicolon | Solhint"
date:        "Sat, 24 Aug 2019 03:06:49 GMT"
author:      "Peter Chung <touhonoob@gmail.com>"
---

# no-spaces-before-semicolon
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Semicolon must not have spaces before.

## Options
This rule does not have options.

## Examples
### 👍 Examples of **correct** code for this rule

#### Expression with correct semicolon align

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          var (a, b,) = test1.test2(); a + b;
        }
    
      }
    ,
      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          test(1, 2, b);
        }
    
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### Expression with incorrect semicolon align

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          var (a, b) = test1.test2() ; a + b;
        }
    
      }
    ,
      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          test(1, 2, b) ;
        }
    
      }
    ,
      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          test(1, 2, b)/* test */;
        }
    
      }
    ,
      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          for ( ;;) {}
        }
    
      }
    ,
      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          for (i = 0; ;) {}
        }
    
      }
    ,
      pragma solidity 0.4.4;
        
        
      contract A {
        
        function b() public {
          for ( ; a < b;) {}
        }
    
      }
    
```

## Version
This rule was introduced in [Solhint 1.1.5](https://github.com/protofire/solhint/tree/v1.1.5)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/align/no-spaces-before-semicolon.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/align/no-spaces-before-semicolon.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/align/no-spaces-before-semicolon.js)
