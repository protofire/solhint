---
layout:      default
title:       Solhint Project Structure
date:        2019-08-27 16:11:00 +0000
author:      "@think-in-universe"
description: Introudciton of the strucutre of the project, how it works, and how to add new rules, etc.
---


# Architecture

The doc is written for the developers who want to understand the structure and mechanism of this project, and how to contriubte.


## Project Structure

Below describes the major structure of the project.

```
├── docs                                 # documentation
├── lib                                  # main source code
│   ├── comment-directive-parser.js      # comment parsers
│   ├── common                           # utility modules for syntax parsing, reporting, etc.
│   ├── config                           # load default, recommended or all rulesets
│   ├── config.js                        # load config
│   ├── doc                              # documentation utilities
│   ├── grammar                          # generated with antlr4.jar and solidity-antlr4
│   ├── index.js                         # package index
│   ├── load-rules.js                    # module for loading rules
│   ├── reporter.js                      # module for reporting lint results
│   ├── rules                            # solhint rules for align, naming, security, etc.
│   └── tree-listener.js                 # security error listener
├── scripts                              # script for generating grammar and rule docs
│   ├── build-grammar.sh
│   └── generate-rule-docs.js
├── solhint.js                           # solhint command line
├── solidity-antlr4                      # git submodule for solidity-antlr4
└── test                                 # test cases
```

## How it Works

### Solidity Grammer with ANTLR

Solhint depends on [ANTLR4](http://www.antlr.org/) to generate the Solidity parser, following the grammar description taken from
[solidity-antlr4](https://github.com/solidityj/solidity-antlr4).

To update the Solidity grammer, you'll need to update the Git submodule solidity-antlr4, and execute `scripts/build-grammar.sh` under root of the project. (Java Runtime Environment (7 or later) is required for running the script.)

### How to Add A New Rule

The Solhint rules in `lib/rules` follows contains the differnet aspects of lint requirements.

The rules are implemented with a visitor pattern. You can extends the `BaseChecker` class with the `ruleId` and `meta` fields to define a rule, and implement methods that are called when a node in the AST is extered or exited. The constructor accepts a reporter and a config, and `ruleId` field is present in the object. This `ruleId` is the one that will be used to activate and configure the rule.

For example, `lib/rules/align/indent.js`:

```javascript

const ruleId = 'indent'
const DEFAULT_SEVERITY = 'error'
const DEFAULT_INDENTS = 4
const meta = {
  type: 'align',

  docs: {
    // ...
  },

  isDefault: true,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_INDENTS],

  schema: [
    {
      type: 'array',
      items: [{ type: 'integer' }],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class IndentChecker {
  constructor(reporter, config) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
    this.linesWithError = []

    const indent = this.parseConfig(config).indent || 4
    const indentUnit = this.parseConfig(config).unit || 'spaces'

    this.blockValidator = new BlockValidator(indent, indentUnit, reporter, this.ruleId)

    // ...
  }

  enterBlock(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterContractDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterStructDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterEnumDefinition(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

  enterImportDirective(ctx) {
    this.blockValidator.validateBlock(ctx)
  }

```

The developer of the rules need to have basic understanding about how the AST nodes works, and create analyzer and parser according to make new rules.

You can see a list of the available AST nodes in [solidity-antlr4](https://github.com/solidityj/solidity-antlr4/blob/master/Solidity.g4) project.


### How to Add a Plugin

You can write your own plugins to add new rules to Solhint. Plugins are just npm packages that export an array of new rules, by following the naming convention of `solhint-plugin-<package-name>`.

Read the [document](https://github.com/protofire/solhint/blob/master/docs/writing-plugins.md) to learn more about writing plugins.


### How to Add Shared Configuration

Shareable configs are configurations that you can use and extend from. They can be useful for using the same base configuration in all your projects or for basing your configuration from a well-known one.

You can either use a shared configuration from `solhint` or from a npm package with the prefix `solhint-config-`.

Read the [document](https://github.com/protofire/solhint/blob/master/docs/shareable-configs.md) to learn more about shared configurations.


## How to Contribute

Solhint is a open source project, and you can follow the [instructions here](https://github.com/protofire/solhint/blob/master/docs/contributing.md) to contribute.

Thanks for your contribution to Solhint.

### Update Rules Doc

To update the rules docs after adding new rules, run the below commands:

1\. Update all rule docs and rule index pages

`./scripts/generate-rule-docs.js or npm run docs`

2\. Update rule doc for specific rule

`./scripts/generate-rule-docs.js --rule-id no-spaces-before-semicolon or npm run docs -- --rule-id no-spaces-before-semicolon`
