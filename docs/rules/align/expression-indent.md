---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "expression-indent | Solhint"
date:        "Sat, 24 Aug 2019 02:21:17 GMT"
author:      "Peter Chung <touhonoob@gmail.com>"
---

# expression-indent
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Expression indentation is incorrect.

## Options
This rule does not have options.

## Examples
### 👍 Examples of **correct** code for this rule

#### Expressions with correct indentation

```solidity
new TrustedContract
myArray[5]
myFunc(1, 2, 3)
emit myEvent(1, 2, 3)
myFunc.call(1)
a = (b + c)
a = b + 1
a += 1
a == b
1**2
a && b
a > b ? a : b
!a
a++
a += 1
a += (b + c) * d
bytesStringTrimmed[j] = bytesString[j]
```

### 👎 Examples of **incorrect** code for this rule

#### Expressions with incorrect indentation

```solidity
new  TrustedContract
myArray[ 5 ]
myArray/* test */[5]
myFunc( 1, 2, 3 )
myFunc. call(1)
a = ( b + c )
a=b + 1
a+=1
a ==b
1** 2
a &&b
a > b ?a : b
! a
a ++
a +=1
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/tree/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/align/expression-indent.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/align/expression-indent.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/align/expression-indent.js)
