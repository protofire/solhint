---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "comprehensive-interface | Solhint"
---

# comprehensive-interface
![Category Badge](https://img.shields.io/badge/-Miscellaneous-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Check that all public or external functions are override. This is useful to make sure that the whole API is extracted in an interface.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "comprehensive-interface": "warn"
  }
}
```


## Examples
### 👍 Examples of **correct** code for this rule

#### All public functions are overrides

```solidity
pragma solidity ^0.7.0;

contract Foo is FooInterface {
  function foo() public override {}
}

```

### 👎 Examples of **incorrect** code for this rule

#### A public function is not an override

```solidity
pragma solidity ^0.7.0;

contract Foo {
  function foo() public {}
}

```

## Version
This rule was introduced in [Solhint 3.3.0](https://github.com/protofire/solhint/tree/v3.3.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/miscellaneous/comprehensive-interface.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/miscellaneous/comprehensive-interface.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/miscellaneous/comprehensive-interface.js)
