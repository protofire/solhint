
# bracket-align
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Open bracket must be on same line. It must be indented by other constructions by space.

## Options
This rule does not have options.

## Examples
### 👍 Examples of **correct** code for this rule

#### Correctly aligned function brackets

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                function a (
                    uint a
                ) 
                    public  
                {
                  continue;
                }
            
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### Incorrectly aligned function brackets

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
        
                function a (uint a) public{
                  continue;
                }

      }
    
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/tree/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/align/bracket-align.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/align/bracket-align.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/align/bracket-align.js)
