---
layout:      default
title:       Validation Rules for Solhint
date:        2017-10-23 14:16:00 +0300
author:      "@drabenia"
description: List of validation rules for Solhint - Solidity security, style guide, best practise validator.
---

### Options
 Default list of options are *false, "error", "warn"*. It supports by all rules.
 It provides in format 
 ```json
 {
    "rules": {
        "RULE_NAME": "<option>"
    }
 }
 ```

### Security Rules

 | Rule ID                       |                      Error                      |     Options               |
 |-------------------------------|-------------------------------------------------|---------------------------|
 | **reentrancy**                | Possible reentrancy vulnerabilities. Avoid state changes after transfer. | *[default](#options)* |
 | **avoid-sha3**                | Use "keccak256" instead of deprecated "sha3"    | *[default](#options)*     |
 | **avoid-suicide**             | Use "selfdestruct" instead of deprecated "suicide" | *[default](#options)*  |
 | **avoid-throw**               | "throw" is deprecated, avoid to use it          | *[default](#options)*     |
 | **func-visibility**           | Explicitly mark visibility in function          | *[default](#options)*     |
 | **state-visibility**          | Explicitly mark visibility of state             | *[default](#options)*     |
 | **check-send-result**         | Check result of "send" call                     | *[default](#options)*     |
 | **avoid-call-value**          | Avoid to use ".call.value()()"                  | *[default](#options)*     |
 | **compiler-fixed**            | Compiler version must be fixed                  | *[default](#options)*     |
 | **compiler-gt-0_4**           | Use at least '0.4' compiler version             | *[default](#options)*     |
 | **no-complex-fallback**       | Fallback function must be simple                | *[default](#options)*     |
 | **mark-callable-contracts**   | Explicitly mark all external contracts as trusted or untrusted | *[default](#options)* |
 | **multiple-sends**            | Avoid multiple calls of "send" method in single transaction | *[default](#options)* |
 | **no-simple-event-func-name** | Event and function names must be different      | *[default](#options)*     |
 | **avoid-tx-origin**           | Avoid to use tx.origin                          | *[default](#options)*     |
 | **no-inline-assembly**        | Avoid to use inline assembly. It is acceptable only in rare cases | *[default](#options)* |
 | **not-rely-on-block-hash**    | Do not rely on "block.blockhash". Miners can influence its value. | *[default](#options)* |
 | **avoid-low-level-calls**     | Avoid to use low level calls.                                     | *[default](#options)* |
 
\* \- All security rules implemented according [ConsenSys Guide for Smart Contracts](https://consensys.github.io/smart-contract-best-practices/recommendations/)
 
### Style Guide Rules
 
 | Rule ID                       |                      Error                         |     Options                    |
 |-------------------------------|----------------------------------------------------|--------------------------------| 
 | **func-name-mixedcase**       | Function name must be in camelCase                 | *[default](#options)*          |
 | **func-param-name-mixedcase** | Function param name must be in mixedCase           | *[default](#options)*          |
 | **var-name-mixedcase**        | Variable name must be in mixedCase                 | *[default](#options)*          |
 | **event-name-camelcase**      | Event name must be in CamelCase                    | *[default](#options)*          |
 | **const-name-snakecase**      | Constant name must be in capitalized SNAKE_CASE    | *[default](#options)*          |
 | **modifier-name-mixedcase**   | Modifier name must be in mixedCase                 | *[default](#options)*          |
 | **contract-name-camelcase**   | Contract name must be in CamelCase                 | *[default](#options)*          |
 | **use-forbidden-name**        | Avoid to use letters 'I', 'l', 'O' as identifiers  | *[default](#options)*          |
 | **visibility-modifier-order** | Visibility modifier must be first in list of modifiers | *[default](#options)*      |
 | **imports-on-top**            | Import statements must be on top                   | *[default](#options)*          |
 | **two-lines-top-level-separator** | Definition must be surrounded with two blank line indent | *[default](#options)*|
 | **func-order**                | Function order is incorrect                        | *[default](#options)*          |
 | **quotes**                    | Use double quotes for string literals. Default *quotes* values is **"double"**. Values must be 'single' or 'double'. |[*\<[default](#options)\>*,&nbsp;\<*quotes*\>] |
 | **no-mix-tabs-and-spaces**    | Mixed tabs and spaces                              | *[default](#options)*          |
 | **indent**                    | Indentation is incorrect                           | [*\<[default](#options)\>*,&nbsp;*\<indent\>*] Default *indent* is **4**.|
 | **bracket-align**             | Open bracket must be on same line. It must be indented by other constructions by space | *[default](#options)* |
 | **array-declaration-spaces**  | Array declaration must not contains spaces         | *[default](#options)*          |
 | **separate-by-one-line-in-contract** | Definitions inside contract / library must be separated by one line | *[default](#options)* |
 | **expression-indent**         | Expression indentation is incorrect.               | *[default](#options)*          |
 | **statement-indent**          | Statement indentation is incorrect.                | *[default](#options)*          |
 | **space-after-comma**         | Comma must be separated from next element by space | *[default](#options)*          |
 | **no-spaces-before-semicolon**| Semicolon must not have spaces before              | *[default](#options)*          |
 
\* \- All style guide rules implemented according [Solidity Style Guide](
http://solidity.readthedocs.io/en/develop/style-guide.html)
 
### Best Practise Rules
 
 | Rule ID                       |                      Error                         |     Options                   |
 |-------------------------------|----------------------------------------------------|-------------------------------| 
 | **max-line-length**           | Line length must be no more than *maxlen*. | [*\<[default](#options)\>*,&nbsp;*\<maxlen\>*] Default *maxlen* is **120**. | 
 | **payable-fallback**          | When fallback is not payable you will not be able to receive ethers | *[default](#options)* |
 | **no-empty-blocks**           | Code contains empty block                          | *[default](#options)*         |
 | **no-unused-vars**            | Variable "name" is unused                          | *[default](#options)*         |
 | **function-max-lines**        | Function body contains "count" lines but allowed no more than *maxlines*. | [*\<[default](#options)\>*,&nbsp;*\<maxlines\>*] Default *maxlines* is **45**. |
 | **code-complexity**           | Function has cyclomatic complexity "current" but allowed no more than *maxcompl*. | [*\<[default](#options)\>*,&nbsp;*\<maxcompl\>*] Default *maxcompl* is **7**. |
 | **max-states-count**          | Contract has "some count" states declarations but allowed no more than *maxstates* | [*\<[default](#options)\>*,&nbsp;*\<maxstates\>*] Default *maxstates* is **15**. |
