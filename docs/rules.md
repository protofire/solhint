---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "Rule Index of Solhint"
---

## Best Practices Rules

| Rule Id                                                                      | Error                                                                                                                                      | Recommended  | Deprecated |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ---------- |
| [code-complexity](./rules/best-practices/code-complexity.md)                 | Function has cyclomatic complexity "current" but allowed no more than configured max complexity.                                           |              |            |
| [explicit-types](./rules/best-practices/explicit-types.md)                   | Forbid or enforce explicit types (like uint256) that have an alias (like uint).                                                            | $~~~~~~~~$✔️ |            |
| [function-max-lines](./rules/best-practices/function-max-lines.md)           | Function body contains "count" lines but allowed no more than maxlines.                                                                    | $~~~~~~~~$✔️ |            |
| [max-line-length](./rules/best-practices/max-line-length.md)                 | Line length should not exceed configured number of characters.                                                                             |              |            |
| [max-states-count](./rules/best-practices/max-states-count.md)               | Contract has "some count" states declarations but allowed no more than defined max states.                                                 | $~~~~~~~~$✔️ |            |
| [no-console](./rules/best-practices/no-console.md)                           | No console.log/logInt/logBytesX/logString/etc & No hardhat and forge-std console.sol import statements.                                    | $~~~~~~~~$✔️ |            |
| [no-empty-blocks](./rules/best-practices/no-empty-blocks.md)                 | Code block has zero statements inside. Exceptions apply.                                                                                   | $~~~~~~~~$✔️ |            |
| [no-global-import](./rules/best-practices/no-global-import.md)               | Import statement includes an entire file instead of selected symbols.                                                                      | $~~~~~~~~$✔️ |            |
| [no-unused-import](./rules/best-practices/no-unused-import.md)               | Imported object name is not being used by the contract.                                                                                    | $~~~~~~~~$✔️ |            |
| [no-unused-private-funcs](./rules/best-practices/no-unused-private-funcs.md) | Private function "name" is not being used within its defining contract. Support overloads.                                                 |              |            |
| [no-unused-vars](./rules/best-practices/no-unused-vars.md)                   | Variable "name" is unused.                                                                                                                 | $~~~~~~~~$✔️ |            |
| [one-contract-per-file](./rules/best-practices/one-contract-per-file.md)     | Enforces the use of ONE Contract per file see [here](https://docs.soliditylang.org/en/v0.8.21/style-guide.html#contract-and-library-names) | $~~~~~~~~$✔️ |            |
| [payable-fallback](./rules/best-practices/payable-fallback.md)               | When fallback is not payable and there is no receive function you will not be able to receive currency.                                    |              |            |
| [reason-string](./rules/best-practices/reason-string.md)                     | Require or revert statement must have a reason string and check that each reason string is at most N characters long.                      | $~~~~~~~~$✔️ |            |
| [use-natspec](./rules/best-practices/use-natspec.md)                         | Enforces the presence and correctness of NatSpec tags.                                                                                     | $~~~~~~~~$✔️ |            |
| [constructor-syntax](./rules/best-practices/constructor-syntax.md)           | Constructors should use the new constructor keyword.                                                                                       | $~~~~~~~~$✔️ |            |
        

## Style Guide Rules

| Rule Id                                                                              | Error                                                                                                           | Recommended  | Deprecated |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [interface-starts-with-i](./rules/naming/interface-starts-with-i.md)                 | Solidity Interfaces names should start with an `I`                                                              | $~~~~~~~~$✔️ |            |
| [duplicated-imports](./rules/miscellaneous/duplicated-imports.md)                    | Check if an import is done twice in the same file and there is no alias                                         | $~~~~~~~~$✔️ |            |
| [const-name-snakecase](./rules/naming/const-name-snakecase.md)                       | Constant name must be in capitalized SNAKE_CASE. (Does not check IMMUTABLES, use immutable-vars-naming)         | $~~~~~~~~$✔️ |            |
| [contract-name-capwords](./rules/naming/contract-name-capwords.md)                   | Contract, Structs and Enums should be in CapWords.                                                              | $~~~~~~~~$✔️ |            |
| [event-name-capwords](./rules/naming/event-name-capwords.md)                         | Event name must be in CapWords.                                                                                 | $~~~~~~~~$✔️ |            |
| [foundry-test-function-naming](./rules/naming/foundry-test-function-naming.md)       | Enforce naming convention on functions for Foundry test cases                                                   |              |            |
| [foundry-test-functions](./rules/naming/foundry-test-functions.md)                   | Enforce naming convention on functions for Foundry test cases (DEPRECATED, use `foundry-test-functions-naming`) |              |            |
| [func-name-mixedcase](./rules/naming/func-name-mixedcase.md)                         | Function name must be in mixedCase.                                                                             | $~~~~~~~~$✔️ |            |
| [func-named-parameters](./rules/naming/func-named-parameters.md)                     | Enforce named parameters for function calls with 4 or more arguments. This rule may have some false positives   |              |            |
| [func-param-name-mixedcase](./rules/naming/func-param-name-mixedcase.md)             | Function param name must be in mixedCase.                                                                       |              |            |
| [immutable-vars-naming](./rules/naming/immutable-vars-naming.md)                     | Check Immutable variables. Capitalized SNAKE_CASE or mixedCase depending on configuration.                      | $~~~~~~~~$✔️ |            |
| [modifier-name-mixedcase](./rules/naming/modifier-name-mixedcase.md)                 | Modifier name must be in mixedCase.                                                                             |              |            |
| [named-parameters-mapping](./rules/naming/named-parameters-mapping.md)               | Solidity v0.8.18 introduced named parameters on the mappings definition.                                        |              |            |
| [private-vars-leading-underscore](./rules/naming/private-vars-leading-underscore.md) | Non-external functions and state variables should start with a single underscore. Others, shouldn't             |              |            |
| [use-forbidden-name](./rules/naming/use-forbidden-name.md)                           | Avoid to use letters 'I', 'l', 'O' as identifiers.                                                              | $~~~~~~~~$✔️ |            |
| [var-name-mixedcase](./rules/naming/var-name-mixedcase.md)                           | Variable names must be in mixedCase. (Does not check IMMUTABLES nor CONSTANTS (use inherent rules for that)     | $~~~~~~~~$✔️ |            |
| [imports-on-top](./rules/order/imports-on-top.md)                                    | Import statements must be on top.                                                                               | $~~~~~~~~$✔️ |            |
| [imports-order](./rules/order/imports-order.md)                                      | Order the imports of the contract to follow a certain hierarchy (read "Notes section")                          |              |            |
| [ordering](./rules/order/ordering.md)                                                | Check order of elements in file and inside each contract, according to the style guide                          |              |            |
| [visibility-modifier-order](./rules/order/visibility-modifier-order.md)              | Visibility modifier must be first in list of modifiers.                                                         | $~~~~~~~~$✔️ |            |
        

## Gas Consumption Rules

| Rule Id                                                                       | Error                                                                                   | Recommended  | Deprecated |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------ | ---------- |
| [gas-calldata-parameters](./rules/gas-consumption/gas-calldata-parameters.md) | Suggest calldata keyword on function arguments when read only                           | $~~~~~~~~$✔️ |            |
| [gas-custom-errors](./rules/gas-consumption/gas-custom-errors.md)             | Enforces the use of Custom Errors over Require with strings error and Revert statements | $~~~~~~~~$✔️ |            |
| [gas-increment-by-one](./rules/gas-consumption/gas-increment-by-one.md)       | Suggest increments by one, like this ++i instead of other type                          | $~~~~~~~~$✔️ |            |
| [gas-indexed-events](./rules/gas-consumption/gas-indexed-events.md)           | Suggest indexed arguments on events for uint, bool and address                          | $~~~~~~~~$✔️ |            |
| [gas-length-in-loops](./rules/gas-consumption/gas-length-in-loops.md)         | Suggest replacing object.length in a loop condition to avoid calculation on each lap    |              |            |
| [gas-multitoken1155](./rules/gas-consumption/gas-multitoken1155.md)           | ERC1155 is a cheaper non-fungible token than ERC721                                     |              |            |
| [gas-named-return-values](./rules/gas-consumption/gas-named-return-values.md) | Enforce the return values of a function to be named                                     |              |            |
| [gas-small-strings](./rules/gas-consumption/gas-small-strings.md)             | Keep strings smaller than 32 bytes. Promote the use of custom errors                    | $~~~~~~~~$✔️ |            |
| [gas-strict-inequalities](./rules/gas-consumption/gas-strict-inequalities.md) | Suggest Strict Inequalities over non Strict ones                                        | $~~~~~~~~$✔️ |            |
| [gas-struct-packing](./rules/gas-consumption/gas-struct-packing.md)           | Suggest to re-arrange struct packing order when it is inefficient                       | $~~~~~~~~$✔️ |            |
        

## Miscellaneous

| Rule Id                                                                               | Error                                                                                                                                    | Recommended  | Deprecated |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [comprehensive-interface](./rules/miscellaneous/comprehensive-interface.md)           | Check that all public or external functions are overridden. This is useful to make sure that the whole API is extracted in an interface. |              |            |
| [foundry-no-block-time-number](./rules/miscellaneous/foundry-no-block-time-number.md) | Warn on the use of block.timestamp / block.number inside Foundry test files; recommend vm.getBlockTimestamp() / vm.getBlockNumber().     |              |            |
| [import-path-check](./rules/miscellaneous/import-path-check.md)                       | Check if an import file exists in target path                                                                                            | $~~~~~~~~$✔️ |            |
| [quotes](./rules/miscellaneous/quotes.md)                                             | Enforces the use of double or simple quotes as configured for string literals. Values must be 'single' or 'double'.                      | $~~~~~~~~$✔️ |            |
        

## Security Rules

| Rule Id                                                                                | Error                                                                                           | Recommended  | Deprecated |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [avoid-call-value](./rules/security/avoid-call-value.md)                               | Avoid to use ".call.value()()".                                                                 | $~~~~~~~~$✔️ |            |
| [avoid-low-level-calls](./rules/security/avoid-low-level-calls.md)                     | Avoid to use low level calls.                                                                   | $~~~~~~~~$✔️ |            |
| [avoid-sha3](./rules/security/avoid-sha3.md)                                           | Use "keccak256" instead of deprecated "sha3".                                                   | $~~~~~~~~$✔️ |            |
| [avoid-suicide](./rules/security/avoid-suicide.md)                                     | Use "selfdestruct" instead of deprecated "suicide".                                             | $~~~~~~~~$✔️ |            |
| [avoid-throw](./rules/security/avoid-throw.md)                                         | "throw" is deprecated, avoid to use it.                                                         | $~~~~~~~~$✔️ |            |
| [avoid-tx-origin](./rules/security/avoid-tx-origin.md)                                 | Avoid to use tx.origin.                                                                         | $~~~~~~~~$✔️ |            |
| [check-send-result](./rules/security/check-send-result.md)                             | Check result of "send" call.                                                                    | $~~~~~~~~$✔️ |            |
| [compiler-version](./rules/security/compiler-version.md)                               | Compiler version must satisfy a semver requirement at least ^0.8.24.                            | $~~~~~~~~$✔️ |            |
| [func-visibility](./rules/security/func-visibility.md)                                 | Explicitly mark visibility in function.                                                         | $~~~~~~~~$✔️ |            |
| [multiple-sends](./rules/security/multiple-sends.md)                                   | Avoid multiple calls of "send" method in single transaction.                                    | $~~~~~~~~$✔️ |            |
| [no-complex-fallback](./rules/security/no-complex-fallback.md)                         | Fallback function must be simple.                                                               | $~~~~~~~~$✔️ |            |
| [no-immutable-before-declaration](./rules/security/no-immutable-before-declaration.md) | Immutable variables should not be used in state variable initializers before they are declared. | $~~~~~~~~$✔️ |            |
| [no-inline-assembly](./rules/security/no-inline-assembly.md)                           | Avoid to use inline assembly. It is acceptable only in rare cases.                              | $~~~~~~~~$✔️ |            |
| [not-rely-on-block-hash](./rules/security/not-rely-on-block-hash.md)                   | Do not rely on "block.blockhash". Miners can influence its value.                               | $~~~~~~~~$✔️ |            |
| [not-rely-on-time](./rules/security/not-rely-on-time.md)                               | Avoid making time-based decisions in your business logic.                                       |              |            |
| [reentrancy](./rules/security/reentrancy.md)                                           | Possible reentrancy vulnerabilities. Avoid state changes after transfer.                        | $~~~~~~~~$✔️ |            |
| [state-visibility](./rules/security/state-visibility.md)                               | Explicitly mark visibility of state.                                                            | $~~~~~~~~$✔️ |            |
        

## References

- [ConsenSys Guide for Smart Contracts](https://consensys.github.io/smart-contract-best-practices/development-recommendations/)
- [Solidity Style Guide](http://solidity.readthedocs.io/en/develop/style-guide.html)
