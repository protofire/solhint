## Solhint Project

[![Build Status](https://travis-ci.org/protofire/solhint.svg?branch=master)](https://travis-ci.org/protofire/solhint)
[![npm version](http://img.shields.io/npm/v/solhint.svg?style=flat)](https://npmjs.org/package/solhint
"Solhint on npmjs.com")
[![Coverage Status](https://coveralls.io/repos/github/protofire/solhint/badge.svg?branch=master)](
https://coveralls.io/github/protofire/solhint?branch=master)
[![dependencies Status](https://david-dm.org/protofire/solhint/status.svg)](https://david-dm.org/protofire/solhint)
[![devDependencies Status](https://david-dm.org/protofire/solhint/dev-status.svg)](https://david-dm.org/protofire/solhint?type=dev)

This is an open source project for linting [Solidity](http://solidity.readthedocs.io/en/develop/) code. This project
provides both **Security** and **Style Guide** validations.

### Installation

You can install Solhint using **npm**:

```sh
npm install -g solhint

# verify that it was installed correctly
solhint -V
```

### Usage

For linting Solidity files you need to run Solhint with one or more [Globs](https://en.wikipedia.org/wiki/Glob_(programming)) as arguments. For example, to lint all files inside `contracts` directory, you can do:

```sh
solhint "contracts/**/*.sol"
```

To lint a single file:

```sh
solhint contracts/MyToken.sol
```

Solhint command description:

```text
Usage: solhint [options] <file> [...other_files]

Linter for Solidity programming language


Options:

  -V, --version           output the version number
  -f, --formatter [name]  report formatter name (stylish, table, tap, unix)
  -h, --help              output usage information


Commands:

  stdin [options]         put source code to stdin of this utility
  init-config             create sample solhint config in current folder
```

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

### Security Rules

 | Rule ID                       |                      Error                                        |
 |-------------------------------|-------------------------------------------------------------------|
 | **reentrancy**                | Possible reentrancy vulnerabilities. Avoid state changes after transfer. |
 | **avoid-sha3**                | Use "keccak256" instead of deprecated "sha3"                      |
 | **avoid-suicide**             | Use "selfdestruct" instead of deprecated "suicide"                |
 | **avoid-throw**               | "throw" is deprecated, avoid to use it                            |
 | **func-visibility**           | Explicitly mark visibility in function                            |
 | **state-visibility**          | Explicitly mark visibility of state                               |
 | **check-send-result**         | Check result of "send" call                                       |
 | **avoid-call-value**          | Avoid to use ".call.value()()"                                    |
 | **compiler-fixed**            | Compiler version must be fixed                                    |
 | **compiler-gt-0_4**           | Use at least '0.4' compiler version                               |
 | **no-complex-fallback**       | Fallback function must be simple                                  |
 | **mark-callable-contracts**   | Explicitly mark all external contracts as trusted or untrusted    |
 | **multiple-sends**            | Avoid multiple calls of "send" method in single transaction       |
 | **no-simple-event-func-name** | Event and function names must be different                        |
 | **avoid-tx-origin**           | Avoid to use tx.origin                                            |
 | **no-inline-assembly**        | Avoid to use inline assembly. It is acceptable only in rare cases |
 | **not-rely-on-block-hash**    | Do not rely on "block.blockhash". Miners can influence its value. |
 | **avoid-low-level-calls**     | Avoid to use low level calls.                                     |

\* \- All security rules implemented according [ConsenSys Guide for Smart Contracts](
https://consensys.github.io/smart-contract-best-practices/recommendations/)

### Style Guide Rules
 
 | Rule ID                       |                      Error                                                |
 |-------------------------------|---------------------------------------------------------------------------|
 | **func-name-mixedcase**       | Function name must be in camelCase                                        |
 | **func-param-name-mixedcase** | Function param name must be in mixedCase                                  |
 | **var-name-mixedcase**        | Variable name must be in mixedCase                                        |
 | **event-name-camelcase**      | Event name must be in CamelCase                                           |
 | **const-name-snakecase**      | Constant name must be in capitalized SNAKE_CASE                           |
 | **modifier-name-mixedcase**   | Modifier name must be in mixedCase                                        |
 | **contract-name-camelcase**   | Contract name must be in CamelCase                                        |
 | **use-forbidden-name**        | Avoid to use letters 'I', 'l', 'O' as identifiers                         |
 | **visibility-modifier-order** | Visibility modifier must be first in list of modifiers                    |
 | **imports-on-top**            | Import statements must be on top                                          |
 | **two-lines-top-level-separator** | Definition must be surrounded with two blank line indent              |
 | **func-order**                | Function order is incorrect                                               |
 | **quotes**                    | Use double quotes for string literals                                     |
 | **no-mix-tabs-and-spaces**    | Mixed tabs and spaces                                                     |
 | **indent**                    | Indentation is incorrect                                                  |
 | **bracket-align**             | Open bracket must be on same line. It must be indented by other constructions by space |
 | **array-declaration-spaces**  | Array declaration must not contains spaces                                |
 | **separate-by-one-line-in-contract** | Definitions inside contract / library must be separated by one line|
 | **expression-indent**         | Expression indentation is incorrect.                                      |
 | **statement-indent**          | Statement indentation is incorrect.                                       |
 | **space-after-comma**         | Comma must be separated from next element by space                        |
 | **no-spaces-before-semicolon**| Semicolon must not have spaces before                                     |
 
\* \- All style guide rules implemented according [Solidity Style Guide](
http://solidity.readthedocs.io/en/develop/style-guide.html)
 
### Best Practise Rules
 
  | Rule ID                       |                      Error                                                       |
  |-------------------------------|----------------------------------------------------------------------------------|
  | **max-line-length**           | Line length must be no more than 120 but current length is 121.                  |
  | **payable-fallback**          | When fallback is not payable you will not be able to receive ethers              |
  | **no-empty-blocks**           | Code contains empty block                                                        |
  | **no-unused-vars**            | Variable "name" is unused                                                        |
  | **function-max-lines**        | Function body contains "count" lines but allowed no more than "maxLines" lines   |
  | **code-complexity**           | Function has cyclomatic complexity "current" but allowed no more than "max"      |
  | **max-states-count**          | Contract has "curCount" states declarations but allowed no more than "max"       |
 
### Documentation

Related documentation you may find [there](https://protofire.github.io/solhint/).

### IDE Integrations

  - **[Sublime Text 3](https://packagecontrol.io/search/solhint)**
  - **[Atom](https://atom.io/packages/atom-solidity-linter)**
  - **[Vim](https://github.com/sohkai/syntastic-local-solhint)**
  - **[JetBrains IDEA, WebStorm, CLion, etc.](https://plugins.jetbrains.com/plugin/10177-solidity-solhint)**
  - **[VS Code: Solidity by Juan Blanco](
         https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)**
  - **[VS Code: Solidity Language Support by CodeChain.io](
         https://marketplace.visualstudio.com/items?itemName=kodebox.solidity-language-server)**

### Licence

MIT
