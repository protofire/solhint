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

For linting Solidity files you need to execute next command

```bash
solhint *.sol **/*.sol <any_other_glob_pattern>
```

Solhint command details 

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
 - [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=idrabenia.solidity-solhint)

### Licence

MIT
