---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "Rule Index of Solhint"
---

## Best Practise Rules

| Rule Id                                                            | Error                                                                                                                 | Recommended  | Deprecated |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [code-complexity](./rules/best-practises/code-complexity.md)       | Function has cyclomatic complexity "current" but allowed no more than maxcompl.                                       |              |            |
| [custom-errors](./rules/best-practises/custom-errors.md)           | Enforces the use of Custom Errors over Require and Revert statements                                                  | $~~~~~~~~$✔️ |            |
| [explicit-types](./rules/best-practises/explicit-types.md)         | Forbid or enforce explicit types (like uint256) that have an alias (like uint).                                       | $~~~~~~~~$✔️ |            |
| [function-max-lines](./rules/best-practises/function-max-lines.md) | Function body contains "count" lines but allowed no more than maxlines.                                               |              |            |
| [max-line-length](./rules/best-practises/max-line-length.md)       | Line length must be no more than maxlen.                                                                              |              |            |
| [max-states-count](./rules/best-practises/max-states-count.md)     | Contract has "some count" states declarations but allowed no more than maxstates.                                     | $~~~~~~~~$✔️ |            |
| [no-console](./rules/best-practises/no-console.md)                 | No console.log/logInt/logBytesX/logString/etc & No hardhat and forge-std console.sol import statements.               | $~~~~~~~~$✔️ |            |
| [no-empty-blocks](./rules/best-practises/no-empty-blocks.md)       | Code block has zero statements inside. Exceptions apply.                                                              | $~~~~~~~~$✔️ |            |
| [no-global-import](./rules/best-practises/no-global-import.md)     | Import statement includes an entire file instead of selected symbols.                                                 | $~~~~~~~~$✔️ |            |
| [no-unused-import](./rules/best-practises/no-unused-import.md)     | Imported object name is not being used by the contract.                                                               | $~~~~~~~~$✔️ |            |
| [no-unused-vars](./rules/best-practises/no-unused-vars.md)         | Variable "name" is unused.                                                                                            | $~~~~~~~~$✔️ |            |
| [payable-fallback](./rules/best-practises/payable-fallback.md)     | When fallback is not payable you will not be able to receive ethers.                                                  | $~~~~~~~~$✔️ |            |
| [reason-string](./rules/best-practises/reason-string.md)           | Require or revert statement must have a reason string and check that each reason string is at most N characters long. | $~~~~~~~~$✔️ |            |
| [constructor-syntax](./rules/best-practises/constructor-syntax.md) | Constructors should use the new constructor keyword.                                                                  |              |            |
        

## Miscellaneous

| Rule Id                                                                     | Error                                                                                                                                  | Recommended  | Deprecated |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [comprehensive-interface](./rules/miscellaneous/comprehensive-interface.md) | Check that all public or external functions are override. This is iseful to make sure that the whole API is extracted in an interface. |              |            |
| [quotes](./rules/miscellaneous/quotes.md)                                   | Use double quotes for string literals. Values must be 'single' or 'double'.                                                            | $~~~~~~~~$✔️ |            |
        

## Style Guide Rules

| Rule Id                                                                              | Error                                                                                                         | Recommended  | Deprecated  |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------ | ----------- |
| [const-name-snakecase](./rules/naming/const-name-snakecase.md)                       | Constant name must be in capitalized SNAKE_CASE. (Does not check IMMUTABLES, use immutable-vars-naming)       | $~~~~~~~~$✔️ |             |
| [contract-name-camelcase](./rules/naming/contract-name-camelcase.md)                 | Contract name must be in CamelCase.                                                                           | $~~~~~~~~$✔️ |             |
| [event-name-camelcase](./rules/naming/event-name-camelcase.md)                       | Event name must be in CamelCase.                                                                              | $~~~~~~~~$✔️ |             |
| [foundry-test-functions](./rules/naming/foundry-test-functions.md)                   | Enforce naming convention on functions for Foundry test cases                                                 |              |             |
| [func-name-mixedcase](./rules/naming/func-name-mixedcase.md)                         | Function name must be in mixedCase.                                                                           | $~~~~~~~~$✔️ |             |
| [func-named-parameters](./rules/naming/func-named-parameters.md)                     | Enforce named parameters for function calls with 4 or more arguments. This rule may have some false positives |              |             |
| [func-param-name-mixedcase](./rules/naming/func-param-name-mixedcase.md)             | Function param name must be in mixedCase.                                                                     |              |             |
| [immutable-vars-naming](./rules/naming/immutable-vars-naming.md)                     | Check Immutable variables. Capitalized SNAKE_CASE or mixedCase depending on configuration.                    | $~~~~~~~~$✔️ |             |
| [modifier-name-mixedcase](./rules/naming/modifier-name-mixedcase.md)                 | Modifier name must be in mixedCase.                                                                           |              |             |
| [named-parameters-mapping](./rules/naming/named-parameters-mapping.md)               | Solidity v0.8.18 introduced named parameters on the mappings definition.                                      |              |             |
| [named-return-values](./rules/naming/named-return-values.md)                         | Enforce the return values of a function to be named                                                           |              |             |
| [private-vars-leading-underscore](./rules/naming/private-vars-leading-underscore.md) | Private and internal names must start with a single underscore.                                               |              |             |
| [use-forbidden-name](./rules/naming/use-forbidden-name.md)                           | Avoid to use letters 'I', 'l', 'O' as identifiers.                                                            | $~~~~~~~~$✔️ |             |
| [var-name-mixedcase](./rules/naming/var-name-mixedcase.md)                           | Variable name must be in mixedCase. (Does not check IMMUTABLES, use immutable-vars-naming)                    | $~~~~~~~~$✔️ |             |
| [func-order](./rules/order/func-order.md)                                            | Function order is incorrect.                                                                                  |              | $~~~~~~~$✔️ |
| [imports-on-top](./rules/order/imports-on-top.md)                                    | Import statements must be on top.                                                                             | $~~~~~~~~$✔️ |             |
| [ordering](./rules/order/ordering.md)                                                | Check order of elements in file and inside each contract, according to the style guide.                       |              |             |
| [visibility-modifier-order](./rules/order/visibility-modifier-order.md)              | Visibility modifier must be first in list of modifiers.                                                       | $~~~~~~~~$✔️ |             |
        

## Security Rules

| Rule Id                                                                | Error                                                                    | Recommended  | Deprecated  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------ | ----------- |
| [avoid-call-value](./rules/security/avoid-call-value.md)               | Avoid to use ".call.value()()".                                          | $~~~~~~~~$✔️ |             |
| [avoid-low-level-calls](./rules/security/avoid-low-level-calls.md)     | Avoid to use low level calls.                                            | $~~~~~~~~$✔️ |             |
| [avoid-sha3](./rules/security/avoid-sha3.md)                           | Use "keccak256" instead of deprecated "sha3".                            | $~~~~~~~~$✔️ |             |
| [avoid-suicide](./rules/security/avoid-suicide.md)                     | Use "selfdestruct" instead of deprecated "suicide".                      | $~~~~~~~~$✔️ |             |
| [avoid-throw](./rules/security/avoid-throw.md)                         | "throw" is deprecated, avoid to use it.                                  | $~~~~~~~~$✔️ |             |
| [avoid-tx-origin](./rules/security/avoid-tx-origin.md)                 | Avoid to use tx.origin.                                                  | $~~~~~~~~$✔️ |             |
| [check-send-result](./rules/security/check-send-result.md)             | Check result of "send" call.                                             | $~~~~~~~~$✔️ |             |
| [compiler-version](./rules/security/compiler-version.md)               | Compiler version must satisfy a semver requirement.                      | $~~~~~~~~$✔️ |             |
| [func-visibility](./rules/security/func-visibility.md)                 | Explicitly mark visibility in function.                                  | $~~~~~~~~$✔️ |             |
| [mark-callable-contracts](./rules/security/mark-callable-contracts.md) | Explicitly mark all external contracts as trusted or untrusted.          |              | $~~~~~~~$✔️ |
| [multiple-sends](./rules/security/multiple-sends.md)                   | Avoid multiple calls of "send" method in single transaction.             | $~~~~~~~~$✔️ |             |
| [no-complex-fallback](./rules/security/no-complex-fallback.md)         | Fallback function must be simple.                                        | $~~~~~~~~$✔️ |             |
| [no-inline-assembly](./rules/security/no-inline-assembly.md)           | Avoid to use inline assembly. It is acceptable only in rare cases.       | $~~~~~~~~$✔️ |             |
| [not-rely-on-block-hash](./rules/security/not-rely-on-block-hash.md)   | Do not rely on "block.blockhash". Miners can influence its value.        | $~~~~~~~~$✔️ |             |
| [not-rely-on-time](./rules/security/not-rely-on-time.md)               | Avoid making time-based decisions in your business logic.                | $~~~~~~~~$✔️ |             |
| [reentrancy](./rules/security/reentrancy.md)                           | Possible reentrancy vulnerabilities. Avoid state changes after transfer. | $~~~~~~~~$✔️ |             |
| [state-visibility](./rules/security/state-visibility.md)               | Explicitly mark visibility of state.                                     | $~~~~~~~~$✔️ |             |
        

## References

- [ConsenSys Guide for Smart Contracts](https://consensys.github.io/smart-contract-best-practices/recommendations/)
- [Solidity Style Guide](http://solidity.readthedocs.io/en/develop/style-guide.html)
