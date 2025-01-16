---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "no-global-import | Solhint"
---

# no-global-import
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practice%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Import statement includes an entire file instead of selected symbols.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Defaults to warn.

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

#### import entire file into a name

```solidity
import "./A.sol" as A
```

#### import entire file into a name

```solidity
import * as A from "./A.sol"
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
This rule was introduced in [Solhint 5.0.4](https://github.com/protofire/solhint/blob/v5.0.4)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/no-global-import.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/no-global-import.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/no-global-import.js)
