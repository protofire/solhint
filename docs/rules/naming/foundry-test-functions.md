---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "foundry-test-functions | Solhint"
---

# foundry-test-functions
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge off](https://img.shields.io/badge/Default%20Severity-off-undefined)

## Description
Enforce naming convention on functions for Foundry test cases

## Options
This rule accepts an array of options:

| Index | Description                                           | Default Value |
| ----- | ----------------------------------------------------- | ------------- |
| 0     | Rule severity. Must be one of "error", "warn", "off". | off           |


### Example Config
```json
{
  "rules": {
    "foundry-test-functions": ["off",["setUp"]]
  }
}
```

### Notes
- This rule can be configured to skip certain function names in the SKIP array. In Example Config. ```setUp``` function will be skipped
- Supported Regex: ```test(Fork)?(Fuzz)?(Fail)?_(Revert(If_|When_){1})?\w{1,}```
- This rule should be executed in a separate folder with a separate .solhint.json => ```solhint --config .solhint.json testFolder/**/*.sol```
- This rule applies only to `external` and `public` functions
- This rule skips the `setUp()` function by default

## Examples
### 👍 Examples of **correct** code for this rule

#### Foundry test case with correct Function declaration

```solidity
function test_NumberIs42() public {}
```

#### Foundry test case with correct Function declaration

```solidity
function testFail_Subtract43() public {}
```

#### Foundry test case with correct Function declaration

```solidity
function testFuzz_FuzzyTest() public {}
```

### 👎 Examples of **incorrect** code for this rule

#### Foundry test case with incorrect Function declaration

```solidity
function numberIs42() public {}
```

## Version
This rule was introduced in [Solhint 3.6.1](https://github.com/protofire/solhint/tree/v3.6.1)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/naming/foundry-test-functions.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/naming/foundry-test-functions.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/naming/foundry-test-functions.js)
