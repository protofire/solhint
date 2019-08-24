<!---
This is a dynamically generated file. Do not edit manually.
date:        Sat, 24 Aug 2019 01:45:11 GMT
author:      "Peter Chung <touhonoob@gmail.com>"
--->

# reentrancy
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Security%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Possible reentrancy vulnerabilities. Avoid state changes after transfer.

## Options
This rule does not have options.

## Examples
### 👍 Examples of **correct** code for this rule

#### Invulnerable Contract 1

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                mapping(address => uint) private shares;

                function b() external {
                    uint amount = shares[msg.sender];
                    shares[msg.sender] = 0;
                    msg.sender.transfer(amount);
                }
            
      }
    
```

#### Invulnerable Contract 2

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                mapping(address => uint) private shares;

                function b() external {
                    uint amount = shares[msg.sender];
                    user.test(amount);
                    shares[msg.sender] = 0;
                }
            
      }
    
```

#### Invulnerable Contract 3

```solidity
undefined
```

### 👎 Examples of **incorrect** code for this rule

#### Vulnerable Contract 1

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                mapping(address => uint) private shares;

                function b() external {
                    uint amount = shares[msg.sender];
                    bool a = msg.sender.send(amount);
                    if (a) { shares[msg.sender] = 0; }
                }
            
      }
    
```

#### Vulnerable Contract 2

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                mapping(address => uint) private shares;

                function b() external {
                    uint amount = shares[msg.sender];
                    msg.sender.transfer(amount);
                    shares[msg.sender] = 0;
                }
            
      }
    
```

## Version
This rule was introduced in [Solhint 1.1.6](https://github.com/protofire/solhint/tree/v1.1.6)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/security/reentrancy.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/security/reentrancy.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/security/reentrancy.js)
