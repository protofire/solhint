## Solhint Project

[![Build Status](https://travis-ci.org/tokenhouse/solhint.svg?branch=master)](https://travis-ci.org/tokenhouse/solhint)

This is an open source project for linting [solidity](http://solidity.readthedocs.io/en/develop/) code. This project 
provide both **security** and **style guide** validations.   

### Installation

For install project you need to execute next commands

```sh
git clone https://github.com/tokenhouse/solhint.git
npm install
npm i -g .
solhint -V
```

### Usage

```text
Usage: solhint [options] <file> [...other_files]

Linter for Solidity programming language


Options:

  -V, --version           output the version number
  -f, --formatter [name]  report formatter name
  -h, --help              output usage information


Commands:

  stdin [options]         put source code to stdin of this utility   
  init-config             create sample solhint config in current folder
```

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

### Security Error Codes:

 | Rule ID                       |                      Error                         |
 |-------------------------------|----------------------------------------------------| 
 | **avoid-sha3**                | Use "keccak256" instead of deprecated "sha3"       |
 | **avoid-suicide**             | Use "selfdestruct" instead of deprecated "suicide" |
 | **avoid-throw**               | "throw" is deprecated, avoid to use it             |
 | **func-visibility**           | Explicitly mark visibility in function             |
 | **state-visibility**          | Explicitly mark visibility of state                |
 | **check-send-result**         | Check result of "send" call                        |
 | **avoid-call-value**          | Avoid to use ".call.value()()"                     |
 | **compiler-fixed**            | Compiler version must be fixed                     |
 | **compiler-gt-0_4**           | Use at least '0.4' compiler version                |
 | **no-complex-fallback**       | Fallback function must be simple                   |
 | **mark-callable-contracts**   | Explicitly mark all external contracts as trusted or untrusted |
 | **multiple-sends**            | Avoid multiple calls of "send" method in single transaction |
 | **no-simple-event-func-name** | Event and function names must be different         |
 
### Style Guide Codes:
 
 | Rule ID                       |                      Error                         |
 |-------------------------------|----------------------------------------------------| 
 | **func-name-mixedcase**       | Function name must be in camelCase                 |
 | **func-param-name-mixedcase** | Function param name must be in mixedCase           |
 | **var-name-mixedcase**        | Variable name must be in mixedCase                 |
 | **event-name-camelcase**      | Event name must be in CamelCase                    |
 | **const-name-snakecase**      | Constant name must be in SNAKE_CASE                |
 | **modifier-name-snakecase**   | Modifier name must be in snake_case                |
 | **contract-name-camelcase**   | Contract name must be in CamelCase                 |
 | **use-forbidden-name**        | Avoid to use letters 'I', 'l', 'O' as identifiers  |
 | **visibility-modifier-order** | Visibility modifier must be first in list of modifiers |
 | **imports-on-top**            | Import statements must be on top                   |
 | **two-lines-top-level-separator** | Definition must be surrounded with two blank line indent |
 
### Licence

MIT
