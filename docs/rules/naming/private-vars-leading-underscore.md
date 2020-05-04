---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "private-vars-leading-underscore | Solhint"
date:        "Thu, 23 Apr 2020 20:59:50 GMT"
author:      "Franco Victorio <victorio.franco@gmail.com>"
---

# private-vars-leading-underscore
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)

## Description
Private and internal names must start with a single underscore.

## Options
This rule accepts a string option of rule severity. Must be one of "error", "warn", "off". Default to warn.

### Example Config
```json
{
  "rules": {
    "private-vars-leading-underscore": "warn"
  }
}
```


## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 3.0.0-rc.3](https://github.com/protofire/solhint/tree/v3.0.0-rc.3)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/private-vars-leading-underscore.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/private-vars-leading-underscore.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/private-vars-leading-underscore.js)
