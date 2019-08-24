---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "func-order | Solhint"
date:        "Sat, 24 Aug 2019 03:06:52 GMT"
author:      "Peter Chung <touhonoob@gmail.com>"
---

# func-order
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Function order is incorrect.

## Options
This rule does not have options.

## Examples
### 👍 Examples of **correct** code for this rule

#### Constructor is placed before other functions

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                constructor() public {}
                function () public payable {}
            
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### Constructor is placed after other functions

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                function () public payable {}
                constructor() public {}
            
      }
    
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/tree/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/order/func-order.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/order/func-order.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/order/func-order.js)
