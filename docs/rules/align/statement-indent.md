<!---
This is a dynamically generated file. Do not edit manually.
date:        Sat, 24 Aug 2019 01:45:04 GMT
author:      "Peter Chung <touhonoob@gmail.com>"
--->

# statement-indent
![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)
![Category Badge](https://img.shields.io/badge/-Style%20Guide%20Rules-informational)
![Default Severity Badge warn](https://img.shields.io/badge/Default%20Severity-warn-yellow)
> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.


## Description
Statement indentation is incorrect.

## Options
This rule does not have options.

## Examples
### 👍 Examples of **correct** code for this rule

#### Statements with correct indentation

```solidity
if (a > b) {}
if (a > b) {} else {}
while (a > b) {}
do {} while (a > b);
for (;;) {}
for (uint i = 0;;) {}
for (; a < b;) {}
for (;; i += 1) {}
for (uint i = 0;; i += 1) {}
for (uint i = 0; i += 1;) {}
for (; a < b; i += 1) {}
for (uint i = 0; a < b; i += 1) {}
if (a < b) { 
  test1();   
} else {     
  test2();   
}            
do {             
  test1();       
} while (a < b); 
```

### 👎 Examples of **incorrect** code for this rule

#### Statements with incorrect indentation

```solidity
if(a > b) {}
if (a > b ) {} else {}
while ( a > b) {}
do {} while (a > b );
for (;; ) {}
for (uint i = 0;; ) {}
for (;a < b; ) {}
for (;;i += 1) {}
for (uint i = 0;;i += 1) {}
for (uint i = 0;i += 1;) {}
for (;a < b; i += 1) {}
for (uint i = 0;a < b; i += 1) {}
if (a < b) { 
  test1();   
}            
else {       
  test2();   
}            
do {           
  test1();     
}              
while (a < b); 
```

## Version
This rule was introduced in [Solhint 2.0.0-alpha.0](https://github.com/protofire/solhint/tree/v2.0.0-alpha.0)

## Resources
- [Rule source](https://github.com/protofire/solhint/tree/master/lib/rules/align/statement-indent.js)
- [Document source](https://github.com/protofire/solhint/tree/master/docs/rules/align/statement-indent.md)
- [Test cases](https://github.com/protofire/solhint/tree/master/test/rules/align/statement-indent.js)
