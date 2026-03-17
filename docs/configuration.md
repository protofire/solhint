---
layout:      default
title:       Solhint Configuration
date:        2017-10-23 14:16:00 +0300
author:      "@drabenia"
description: Configuration of solidity security and style guide verification, 
             best practice validations.
---

### Configuration

You can use a `.solhint.json` file to configure Solhint globally.
 
To generate a new  sample `.solhint.json` file in current folder you can do:
```sh
solhint init-config
```

This file has the following
format:


```json
  {
    "extends": "solhint:recommended",
    "plugins": [],
    "rules": {
      "const-name-snakecase": "off",
      "avoid-suicide": "error",
      "avoid-sha3": "warn",
      "avoid-tx-origin": "warn",
      "not-rely-on-time": "warn",
      "not-rely-on-block-hash": "warn"
    }
  }
```
A full list of all supported rules can be found [here](https://github.com/protofire/solhint/blob/master/docs/rules.md). 

To ignore files / folders that do not require validation you may use `.solhintignore` file. It supports rules in
`.gitignore` format.

```git exclude
node_modules/
additional-tests.sol
```


### Plugins and `pluginPaths`

Solhint resolves plugins from `process.cwd()` by default and can also use extra paths from `pluginPaths`.

Resolution paths include:

1. `process.cwd()`
2. each `pluginPaths` entry
3. each `<pluginPath>/node_modules`

`pluginPaths` accepts either a string or an array:

```json
{
  "pluginPaths": ["/some/path"],
  "plugins": ["myplugin"]
}
```

If one plugin cannot be loaded, Solhint emits a warning and continues linting with core rules and any other valid plugins.

### Configure linter with comments

You can use comments in the source code to configure solhint in a given line or file.

For example, to disable all validations in the line following a comment:

```solidity
  // solhint-disable-next-line
  uint[] a;
```

You can disable rules on a given line. For example, to disable validation of time and block hash based computations 
in the next line:

```solidity
  // solhint-disable-next-line not-rely-on-time, not-rely-on-block-hash
  uint pseudoRand = uint(keccak256(abi.encodePacked(now, blockhash(block.number))));
```

Disable validation on current line:

```solidity
  uint pseudoRand = uint(keccak256(abi.encodePacked(now, blockhash(block.number)))); // solhint-disable-line
```

Disable validation of time and block hash based computations on current line:

```solidity
   uint pseudoRand = uint(keccak256(abi.encodePacked(now, blockhash(block.number)))); // solhint-disable-line not-rely-on-time, not-rely-on-block-hash 
```

You can disable a rule for a group of lines:

```solidity
  /* solhint-disable avoid-tx-origin */
  function transferTo(address to, uint amount) public {
    require(tx.origin == owner);
    to.call.value(amount)();
  }
  /* solhint-enable avoid-tx-origin */
```

Or disable all validations for a group of lines:

```solidity
  /* solhint-disable */
  function transferTo(address to, uint amount) public {
    require(tx.origin == owner);
    to.call.value(amount)();
  }
  /* solhint-enable */
```
