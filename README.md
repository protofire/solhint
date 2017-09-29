## Solhint Project

[![Build Status](https://travis-ci.org/tokenhouse/solhint.svg?branch=master)](https://travis-ci.org/tokenhouse/solhint)
[![npm version](http://img.shields.io/npm/v/solhint.svg?style=flat)](https://npmjs.org/package/solhint 
"View this project on npm")
[![Coverage Status](https://coveralls.io/repos/github/tokenhouse/solhint/badge.svg?branch=master)](
https://coveralls.io/github/tokenhouse/solhint?branch=master)

This is an open source project for linting [solidity](http://solidity.readthedocs.io/en/develop/) code. This project 
provide both **security** and **style guide** validations.   

### Installation

For install project you need to execute next commands

```sh
npm install -g solhint
solhint -V
```

### Usage

```text
Usage: solhint [options] <file> [...other_files]

Linter for Solidity programming language


Options:

  -V, --version           output the version number
  -f, --formatter [name]  Report formatter name
  -h, --help              output usage information


Commands:

  stdin [options] 
  init-config     
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
 
```text
  // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
  pragma solidity ^0.4.4; 
```

Disable validation on current line

```text
  pragma solidity ^0.4.4; // solhint-disable-line
```

Disable validation of fixed compiler version validation on current line 

```text
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
 | **avoid-tx-origin**           | Avoid to use tx.origin                             |
 
### Style Guide Codes:
 
 | Rule ID                       |                      Error                         |
 |-------------------------------|----------------------------------------------------| 
 | **func-name-mixedcase**       | Function name must be in camelCase                 |
 | **func-param-name-mixedcase** | Function param name must be in mixedCase           |
 | **var-name-mixedcase**        | Variable name must be in mixedCase                 |
 | **event-name-camelcase**      | Event name must be in CamelCase                    |
 | **const-name-snakecase**      | Constant name must be in SNAKE_CASE                |
 | **modifier-name-mixedcase**   | Modifier name must be in mixedCase                 |
 | **contract-name-camelcase**   | Contract name must be in CamelCase                 |
 | **use-forbidden-name**        | Avoid to use letters 'I', 'l', 'O' as identifiers  |
 | **visibility-modifier-order** | Visibility modifier must be first in list of modifiers |
 | **imports-on-top**            | Import statements must be on top                   |
 | **two-lines-top-level-separator** | Definition must be surrounded with two blank line indent |
 | **func-order**                | Function order is incorrect                        |
 | **quotes**                    | Use double quotes for string literals              |
 | **no-mix-tabs-and-spaces**    | Mixed tabs and spaces                              |
 | **indent**                    | Indentation is incorrect                           |
 | **bracket-align**             | Open bracket must be on same line. It must be indented by other constructions by space |
 | **array-declaration-spaces**  | Array declaration must not contains spaces         |
 | **separate-by-one-line-in-contract** | Definitions inside contract / library must be separated by one line |
 | **expression-indent**         | Expression indentation is incorrect.               |
 | **statement-indent**          | Statement indentation is incorrect.                |
 | **max-line-length**           | Line length must be no more than 120 but current length is 121. |
 | **payable-fallback**          | When fallback is not payable you will not be able to receive ethers |
 | **no-empty-blocks**           | Code contains empty block                          |
 | **no-unused-vars**            | Variable "name" is unused                          |
 | **function-max-lines**        | Function body contains "count" lines but allowed no more than "maxLines" lines |
 | **space-after-comma**         | Comma must be separated from next element by space |
 | **no-spaces-before-semicolon**| Semicolon must not have spaces before              |
 
### Documentation

Related documentation you may find [there](https://tokenhouse.github.io/solhint/).

### Licence

MIT