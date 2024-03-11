---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "non-state-vars-leading-underscore | Solhint"
---

# non-state-vars-leading-underscore
![Category Badge](https://img.shields.io/badge/-Best%20Practice%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Variables that are not in contract state should start with underscore. Conversely, variables that can cause an SLOAD/SSTORE should NOT start with an underscore. This makes it evident which operations cause expensive storage access when hunting for gas optimizations

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "non-state-vars-leading-underscore": "warn"
  }
}
```

### Notes
- event & custom error parameters and struct memer names are ignored since they do not define variables
- this rule is contradictory with private-vars-leading-underscore, only one of them should be enabled at the same time.

## Examples
### 👍 Examples of **correct** code for this rule

#### mutable variable should NOT start with underscore since they DO cause storage read/writes

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        uint256 public foo;
      }
    
```

#### immutable variable should start with underscore since they do not cause storage reads

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        uint256 immutable public _FOO;
      }
    
```

#### block variable with leading underscore

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        function foo() public { uint _myVar; }
      }
    
```

#### function parameter with leading underscore

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        function foo( uint256 _foo ) public {}
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### mutable variable starting with underscore

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        uint256 public _foo;
      }
    
```

#### block variable without leading underscore

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        function foo() public { uint myVar; }
      }
    
```

#### function parameter without leading underscore

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        function foo( uint256 foo ) public {}
      }
    
```

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/non-state-vars-leading-underscore.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/non-state-vars-leading-underscore.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/non-state-vars-leading-underscore.js)
