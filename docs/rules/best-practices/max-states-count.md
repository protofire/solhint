---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "max-states-count | Solhint"
---

# max-states-count
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practice%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Contract has "some count" states declarations but allowed no more than maxstates.

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | warn          |
| 1     | Maximum allowed number of states declarations         | 15            |


### Example Config
```json
{
  "rules": {
    "max-states-count": ["warn",15]
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### Low number of states

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
                uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
        uint private constant TEST = 1;
      }
    
```

### 👎 Examples of **incorrect** code for this rule

#### High number of states

```solidity

      pragma solidity 0.4.4;
        
        
      contract A {
                uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
        uint private a;
      }
    
```

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/max-states-count.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/max-states-count.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/max-states-count.js)
