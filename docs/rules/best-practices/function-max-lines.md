---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "function-max-lines | Solhint"
---

# function-max-lines
![Category Badge](https://img.shields.io/badge/-Best%20Practice%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Function body contains "count" lines but allowed no more than maxlines.

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | warn          |
| 1     | Maximum allowed lines count per function              | 50            |


### Example Config
```json
{
  "rules": {
    "function-max-lines": ["warn",50]
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 5.0.4](https://github.com/protofire/solhint/blob/v5.0.4)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/best-practices/function-max-lines.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/best-practices/function-max-lines.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/best-practices/function-max-lines.js)
