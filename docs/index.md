---
title:       Solhint - Solidity Linter
date:        2017-10-23 14:16:00 +0300
author:      "@drabenia"
description: This is an open source project for validating Solidity code. 
             The project provides solidity security, style guide and best practise validations.
---

## Solhint Project

[![Build Status](https://travis-ci.org/protofire/solhint.svg?branch=master)](https://travis-ci.org/protofire/solhint)
[![npm version](http://img.shields.io/npm/v/solhint.svg?style=flat)](https://npmjs.org/package/solhint 
"View this project on npm")
[![Coverage Status](https://coveralls.io/repos/github/protofire/solhint/badge.svg?branch=master)](
https://coveralls.io/github/protofire/solhint?branch=master)

This is an open source project for linting [solidity](http://solidity.readthedocs.io/en/develop/) code. This project 
provide both **security** and **style guide** validations.   

### Installation

You can install Solhint using **npm**:

```sh
npm install -g solhint

# verify that it was installed correctly
solhint -V
```

### Usage

For linting Solidity files you need to run Solhint with one or more 
[Globs](https://en.wikipedia.org/wiki/Glob_(programming)) as arguments. For example, to lint all files inside 
`contracts` directory, you can do:

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

### Docs

 - [List of Rules](./rules.html)
 - [Configuration](./configuration.html)
 - [Formatters](https://eslint.org/docs/user-guide/formatters/)
 - [Use Solhint in Your Application](./use-in-app.html)

### IDE Integrations
 
  - [Sublime Text 3](https://packagecontrol.io/search/solhint)
  - [Atom](https://atom.io/packages/atom-solidity-linter)
  - [Vim](https://github.com/sohkai/syntastic-local-solhint)
  - [JetBrains IDEA, WebStorm, CLion, etc.](https://plugins.jetbrains.com/plugin/10177-solidity-solhint)
  - [VS Code: Solidity by Juan Blanco](
         https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)
  - [VS Code: Solidity Language Support by CodeChain.io](
         https://marketplace.visualstudio.com/items?itemName=kodebox.solidity-language-server)

### Licence

MIT
