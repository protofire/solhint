---
layout:      default
title:       Solhint Configuration
date:        2017-10-23 14:16:00 +0300
author:      "@drabenia"
description: Configuration of solidity security and style guide verification, 
             best practise validations.
---

### Configuration

You can use a `.solhint.json` file to configure Solhint globally. This file has the following
format:

```json
  {
    "extends": "default",
    "rules": {
      "avoid-throw": false,
      "avoid-suicide": "error",
      "avoid-sha3": "warn",
      "indent": ["warn", 4]
    }
  }
```

To ignore files / folders that do not require validation you may use `.solhintignore` file. It supports rules in 
`.gitignore` format.

```git exclude
node_modules/
additiona-tests.sol
```

### Configure linter with comments

You can use comments in the source code to configure solhint in a given line or file.

For example, to disable all validations in the line following a comment:

```javascript
  // solhint-disable-next-line
  uint[] a;
```

You can disable a single rule on a given line. For example, to disable validation of fixed compiler
version in the next line:

```text
  // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
  pragma solidity ^0.4.4;
```

Disable validation on current line:

```text
  pragma solidity ^0.4.4; // solhint-disable-line
```

Disable validation of fixed compiler version validation on current line:

```text
  pragma solidity ^0.4.4; // solhint-disable-line compiler-fixed, compiler-gt-0_4
```

You can disable a rule for a group of lines:

```javascript
  /* solhint-disable avoid-throw */
  if (a > 1) {
    throw;
  }
  /* solhint-enable avoid-throw */
```

Or disable all validations for a group of lines:

```javascript
  /* solhint-disable */
  if (a > 1) {
    throw;
  }
  /* solhint-enable */
```
