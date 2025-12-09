---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "foundry-no-block-time-number | Solhint"
---

# foundry-no-block-time-number
![Category Badge](https://img.shields.io/badge/-Miscellaneous-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Warn on the use of block.timestamp / block.number inside Foundry test files; recommend vm.getBlockTimestamp() / vm.getBlockNumber().

## Options
This rule accepts an array of options:

| Index | Description                                                                                    | Default Value    |
| ----- | ---------------------------------------------------------------------------------------------- | ---------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off".                                          | warn             |
| 1     | Array of folder names for solhint to execute (defaults to ["test","tests"], case-insensitive). | ["test","tests"] |


### Example Config
```json
{
  "rules": {
    "foundry-no-block-time-number": [
      "warn",
      [
        "test",
        "tests"
      ]
    ]
  }
}
```

### Notes
- This rule only runs for files located under the configured test directories (e.g., test/** or tests/**).

## Examples
This rule does not have examples.

## Version
This rule was introduced in the latest version.

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/miscellaneous/foundry-no-block-time-number.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/miscellaneous/foundry-no-block-time-number.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/miscellaneous/foundry-no-block-time-number.js)
