---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "use-natspec | Solhint"
---

# use-natspec
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Best%20Practices%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Enforces the presence and correctness of NatSpec tags.

## Options
This rule accepts an array of options:

| Index | Description                                                              | Default Value        |
| ----- | ------------------------------------------------------------------------ | -------------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".                    | warn                 |
| 1     | A JSON object with natspec properties. See EXAMPLE CONFIG section below. | Check EXAMPLE CONFIG |


### Example Config
```json
{
  "rules": {
    "use-natspec": [
      "warn",
      {
        "title": {
          "enabled": true,
          "ignore": {}
        },
        "author": {
          "enabled": true,
          "ignore": {}
        },
        "notice": {
          "enabled": true,
          "ignore": {}
        },
        "param": {
          "enabled": true,
          "ignore": {}
        },
        "return": {
          "enabled": true,
          "ignore": {}
        }
      }
    ]
  }
}
```

### Notes
- If a function or return value has unnamed parameters (e.g. `function foo(uint256)`), the rule only checks the number of `@param` or `@return` tags, not their names.
- If a function or variable has `@inheritdoc`, the rule skips the validation.
- The rule supports both `///` and `/** */` style NatSpec comments.
- If a custom config is provided, it is merged with the default config. Only the overridden fields need to be specified.

## Examples
### 👍 Examples of **correct** code for this rule

#### Contract with valid NatSpec

```solidity

                /// @title Token contract
                /// @author Me
                /// @notice This contract handles tokens
                contract Token {
                  /// @notice Transfers tokens
                  /// @param to The recipient address
                  /// @param amount The amount to transfer
                  /// @return success Whether the transfer succeeded
                  function transfer(address to, uint256 amount) public returns (bool success) {
                    return true;
                  }
                }
              
```

#### You can disable specific tags globally or by type/name using the `ignore` option in the config. For example:

```solidity
{
                "use-natspec": [
                  "warn",
                  {
                    "title": {
                      "enabled": true,
                      "ignore": {
                        "contract": ["MyContract"],
                        "*": ["LegacyContract"]
                      }
                    },
                    "param": { "enabled": false }
                  }
                ]
              }
```

#### The default configuration enables all checks with no ignore rules:

```solidity
{
                "title": { "enabled": true, "ignore": {} },
                "author": { "enabled": true, "ignore": {} },
                "notice": { "enabled": true, "ignore": {} },
                "param": { "enabled": true, "ignore": {} },
                "return": { "enabled": true, "ignore": {} }
              }
```

### 👎 Examples of **incorrect** code for this rule

#### Missing @notice and incorrect @param and @return tags

```solidity

                /// @title Token contract
                contract Token {
                  /// @param wrongParam Not matching actual parameter
                  function transfer(address to) public returns (bool) {
                    return true;
                  }
                }
                
```

## Version
This rule was introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/use-natspec.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/use-natspec.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/use-natspec.js)
