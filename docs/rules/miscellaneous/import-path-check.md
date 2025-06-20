---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "import-path-check | Solhint"
---

# import-path-check
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Miscellaneous-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Check if an import file exits in target path

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | warn          |


### Example Config
```json
{
  "rules": {
    "import-path-check": ["warn",["[~dependenciesPath]"]]
  }
}
```

### Notes
- Rule checks relative and absolute path first. Then checks for each dependency path in config file
- `searchOn`: an array of paths to check in specified order
- If `searchOn` is empty only `DEFAULT_LOCATIONS` are used.
- If `searchOn` has value, will be concatenated with DEFAULT_LOCATIONS.
- If config has `extends:recommended` or `all` and rule is overwritten with `searchOn`, values are concatenated with DEFAULT_LOCATIONS.

     *Default Locations:*
    - /[`~current-project`]
    - /[`~current-project`]/contracts
    - /[`~current-project`]/src
    - /[`~current-project`]/node_modules
    - /[`~current-project`]/artifacts
    - /[`~current-project`]/cache
    - /[`~current-project`]/lib
    - /[`~current-project`]/out
    - /usr/local/lib/node_modules
    - /home/[`~user`]/.nvm/versions/node/[~node-version]/lib/node_modules
    - /home/[`~user`]/.yarn/global/node_modules
    - /npm/node_modules (for Windows)
    - /Yarn/Data/global/node_modules (for Windows)
- WINDOWS OS file structure has not been thoroughly tested.

## Examples
This rule does not have examples.

## Version
This rule was introduced in [Solhint 5.1.0](https://github.com/protofire/solhint/blob/v5.1.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/blob/master/lib/rules/miscellaneous/import-path-check.js)
- [Document source](https://github.com/protofire/solhint/blob/master/docs/rules/miscellaneous/import-path-check.md)
- [Test cases](https://github.com/protofire/solhint/blob/master/test/rules/miscellaneous/import-path-check.js)
