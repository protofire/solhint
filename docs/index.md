---
title:       Solhint - Solidity Linter
date:        2017-10-23 14:16:00 +0300
author:      "@drabenia"
description: This is an open source project for validating Solidity code.
             The project provides solidity security, style guide and best practise validations.
---

## Solhint Project
[![Donate with Ethereum](https://en.cryptobadges.io/badge/micro/0xe8cdf02efd8ab0a490d7b2cb13553389c9bc932e)](https://en.cryptobadges.io/donate/0xe8cdf02efd8ab0a490d7b2cb13553389c9bc932e)

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/solhint/Lobby)
[![Build Status](https://travis-ci.org/protofire/solhint.svg?branch=master)](https://travis-ci.org/protofire/solhint)
[![NPM version](https://badge.fury.io/js/solhint.svg)](https://npmjs.org/package/solhint)
[![Coverage Status](https://coveralls.io/repos/github/protofire/solhint/badge.svg?branch=master)](
https://coveralls.io/github/protofire/solhint?branch=master)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/protofire/solhint/master/LICENSE)
[![dependencies Status](https://david-dm.org/protofire/solhint/status.svg)](https://david-dm.org/protofire/solhint)
[![devDependencies Status](https://david-dm.org/protofire/solhint/dev-status.svg)](https://david-dm.org/protofire/solhint?type=dev)

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

  -V, --version                              output the version number
  -f, --formatter [name]                     report formatter name (stylish, table, tap, unix)
  -w, --max-warnings [maxWarningsNumber]     number of warnings to trigger nonzero
  -q --quiet                                 report errors only - default: false
  --ignore-path [file_name]                  file to use as your .solhintignore
  -h, --help                                 output usage information


Commands:

  stdin [options]         put source code to stdin of this utility
  init-config             create sample solhint config in current folder
```

You can use any of the following formatters supported by ESLint. 
See EsLint docs about formatters [here](https://eslint.org/docs/user-guide/formatters/).

  -  checkstyle
  -  codeframe
  -  compact
  -  html
  -  jslint-xml
  -  junit
  -  stylish
  -  table
  -  tap
  -  unix
  -  visualstudio

### Docs

 - [List of Rules](./rules.html)
 - [Configuration](./configuration.html)
 - [Use Solhint in Your Application](./use-in-app.html)

### Table of Contents

* [Roadmap](./roadmap.html): The core project's roadmap - what the core team is looking to work on in the near future.
* [Contributing](./contributing.html): The core Solhint team :heart: contributions. This describes how you can contribute to the Solhint Project.

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

### Back Us
Solhint is free to use and open-sourced. If you value our effort and feel like helping us to keep pushing this tool forward, you can send us a small donation. We'll highly appreciate it :)

[![Donate with Ethereum](https://en.cryptobadges.io/badge/micro/0xe8cdf02efd8ab0a490d7b2cb13553389c9bc932e)](https://en.cryptobadges.io/donate/0xe8cdf02efd8ab0a490d7b2cb13553389c9bc932e)
