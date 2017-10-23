---
layout:      default
title:       Solhint Configuration
date:        2017-10-23 14:16:00 +0300
author:      "@drabenia"
description: Configuration of solidity security validation, solidity style guide verification, 
             solidity best practise validations.
---


### Configuration 

Configuration file has next format:

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

### Configure linter with comments

Disable validation on next line

```javascript
  // solhint-disable-next-line
  uint[] a;
```

Disable validation of fixed compiler version validation on next line
 
```javascript
  // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
  pragma solidity ^0.4.4; 
```

Disable validation on current line

```javascript
  pragma solidity ^0.4.4; // solhint-disable-line
```

Disable validation of fixed compiler version validation on current line 

```javascript
  pragma solidity ^0.4.4; // solhint-disable-line compiler-fixed, compiler-gt-0_4
```

Disable linter rules for code fragment 

```javascript
  /* solhint-disable avoid-throw */
  if (a > 1) {
    throw;
  }
  /* solhint-enable avoid-throw */
```

Disable all linter rules for code fragment

```javascript
  /* solhint-disable */
  if (a > 1) {
    throw;
  }
  /* solhint-enable */
```