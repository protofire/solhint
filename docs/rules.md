---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "Rule Index of Solhint"
date:        "Sat, 24 Aug 2019 03:06:57 GMT"
author:      "Peter Chung <touhonoob@gmail.com>"
---

## Style Guide Rules

| Rule Id                                                                                 | Error                                                                                   |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [array-declaration-spaces](./rules/align/array-declaration-spaces.html)                 | Array declaration must not contains spaces.                                             |
| [bracket-align](./rules/align/bracket-align.html)                                       | Open bracket must be on same line. It must be indented by other constructions by space. |
| [expression-indent](./rules/align/expression-indent.html)                               | Expression indentation is incorrect.                                                    |
| [indent](./rules/align/indent.html)                                                     | Indentation is incorrect.                                                               |
| [no-mix-tabs-and-spaces](./rules/align/no-mix-tabs-and-spaces.html)                     | Mixed tabs and spaces.                                                                  |
| [no-spaces-before-semicolon](./rules/align/no-spaces-before-semicolon.html)             | Semicolon must not have spaces before.                                                  |
| [space-after-comma](./rules/align/space-after-comma.html)                               | Comma must be separated from next element by space.                                     |
| [statement-indent](./rules/align/statement-indent.html)                                 | Statement indentation is incorrect.                                                     |
| [quotes](./rules/miscellaneous/quotes.html)                                             | Use double quotes for string literals. Values must be 'single' or 'double'.             |
| [const-name-snakecase](./rules/naming/const-name-snakecase.html)                        | Constant name must be in capitalized SNAKE_CASE.                                        |
| [contract-name-camelcase](./rules/naming/contract-name-camelcase.html)                  | Contract name must be in CamelCase.                                                     |
| [event-name-camelcase](./rules/naming/event-name-camelcase.html)                        | Event name must be in CamelCase.                                                        |
| [func-name-mixedcase](./rules/naming/func-name-mixedcase.html)                          | Function name must be in camelCase.                                                     |
| [func-param-name-mixedcase](./rules/naming/func-param-name-mixedcase.html)              | Function name must be in camelCase.                                                     |
| [modifier-name-mixedcase](./rules/naming/modifier-name-mixedcase.html)                  | Modifier name must be in mixedCase.                                                     |
| [use-forbidden-name](./rules/naming/use-forbidden-name.html)                            | Avoid to use letters 'I', 'l', 'O' as identifiers.                                      |
| [var-name-mixedcase](./rules/naming/var-name-mixedcase.html)                            | Variable name must be in mixedCase.                                                     |
| [func-order](./rules/order/func-order.html)                                             | Function order is incorrect.                                                            |
| [imports-on-top](./rules/order/imports-on-top.html)                                     | Import statements must be on top.                                                       |
| [separate-by-one-line-in-contract](./rules/order/separate-by-one-line-in-contract.html) | Definitions inside contract / library must be separated by one line.                    |
| [two-lines-top-level-separator](./rules/order/two-lines-top-level-separator.html)       | Definition must be surrounded with two blank line indent.                               |
| [visibility-modifier-order](./rules/order/visibility-modifier-order.html)               | Visibility modifier must be first in list of modifiers.                                 |
        

## Best Practise Rules

| Rule Id                                                              | Error                                                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [code-complexity](./rules/best-practises/code-complexity.html)       | Function has cyclomatic complexity "current" but allowed no more than maxcompl.                                       |
| [function-max-lines](./rules/best-practises/function-max-lines.html) | Function body contains "count" lines but allowed no more than maxlines.                                               |
| [max-line-length](./rules/best-practises/max-line-length.html)       | Line length must be no more than maxlen.                                                                              |
| [max-states-count](./rules/best-practises/max-states-count.html)     | Contract has "some count" states declarations but allowed no more than maxstates.                                     |
| [no-empty-blocks](./rules/best-practises/no-empty-blocks.html)       | Code contains empty block.                                                                                            |
| [no-unused-vars](./rules/best-practises/no-unused-vars.html)         | Variable "name" is unused.                                                                                            |
| [payable-fallback](./rules/best-practises/payable-fallback.html)     | When fallback is not payable you will not be able to receive ethers.                                                  |
| [reason-string](./rules/best-practises/reason-string.html)           | Require or revert statement must have a reason string and check that each reason string is at most N characters long. |
| [constructor-syntax](./rules/best-practises/constructor-syntax.html) | Constructors should use the new constructor keyword.                                                                  |
        

## Security Rules

| Rule Id                                                                      | Error                                                                    |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [avoid-call-value](./rules/security/avoid-call-value.html)                   | Avoid to use ".call.value()()".                                          |
| [avoid-low-level-calls](./rules/security/avoid-low-level-calls.html)         | Avoid to use low level calls.                                            |
| [avoid-sha3](./rules/security/avoid-sha3.html)                               | Use "keccak256" instead of deprecated "sha3".                            |
| [avoid-suicide](./rules/security/avoid-suicide.html)                         | Use "selfdestruct" instead of deprecated "suicide".                      |
| [avoid-throw](./rules/security/avoid-throw.html)                             | "throw" is deprecated, avoid to use it.                                  |
| [avoid-tx-origin](./rules/security/avoid-tx-origin.html)                     | Avoid to use tx.origin.                                                  |
| [check-send-result](./rules/security/check-send-result.html)                 | Check result of "send" call.                                             |
| [compiler-fixed](./rules/security/compiler-fixed.html)                       | Compiler version must be fixed.                                          |
| [compiler-gt-0_4](./rules/security/compiler-gt-0_4.html)                     | Compiler version must be fixed.                                          |
| [compiler-version](./rules/security/compiler-version.html)                   | Compiler version must satisfy a semver requirement.                      |
| [func-visibility](./rules/security/func-visibility.html)                     | Explicitly mark visibility in function.                                  |
| [mark-callable-contracts](./rules/security/mark-callable-contracts.html)     | Explicitly mark all external contracts as trusted or untrusted.          |
| [multiple-sends](./rules/security/multiple-sends.html)                       | Avoid multiple calls of "send" method in single transaction.             |
| [no-complex-fallback](./rules/security/no-complex-fallback.html)             | Fallback function must be simple.                                        |
| [no-inline-assembly](./rules/security/no-inline-assembly.html)               | Avoid to use inline assembly. It is acceptable only in rare cases.       |
| [no-simple-event-func-name](./rules/security/no-simple-event-func-name.html) | Event and function names must be different.                              |
| [not-rely-on-block-hash](./rules/security/not-rely-on-block-hash.html)       | Do not rely on "block.blockhash". Miners can influence its value.        |
| [not-rely-on-time](./rules/security/not-rely-on-time.html)                   | Avoid to make time-based decisions in your business logic.               |
| [reentrancy](./rules/security/reentrancy.html)                               | Possible reentrancy vulnerabilities. Avoid state changes after transfer. |
| [state-visibility](./rules/security/state-visibility.html)                   | Explicitly mark visibility of state.                                     |
        

## References

- [ConsenSys Guide for Smart Contracts](https://consensys.github.io/smart-contract-best-practices/recommendations/)
- [Solidity Style Guide](http://solidity.readthedocs.io/en/develop/style-guide.html)
