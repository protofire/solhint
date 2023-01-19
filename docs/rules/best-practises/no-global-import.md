---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-global-import | Solhint"
---

# no-global-import
![Category Badge](https://img.shields.io/badge/-Best%20Practise%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Import statement includes an entire file instead of selected symbols

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "no-global-import": "warn"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### import names explicitly

```solidity
import {A} from "./A.sol"
```

### 👎 Examples of **incorrect** code for this rule

#### import all members from a file

```solidity
import * from "foo.sol"
```

#### import an entire file

```solidity
import "foo.sol"
```

## Version
This rule is introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/best-practises/no-global-import.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/best-practises/no-global-import.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/best-practises/no-global-import.js)
