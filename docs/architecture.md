---
layout:      default
title:       Solhint Project Structure
date:        2019-08-27 16:11:00 +0000
author:      "@think-in-universe"
description: Introduction of the structure of the project, how it works, and how to add new rules, etc.
---


# Architecture

This document is for developers who want to understand the structure and mechanisms of this project, and how to contribute.


## Project Structure

The file structure below describes the most important files and directories of the project.

```
├── conf/rulesets                        # solhint official configs
├── docs                                 # documentation
├── lib
│   ├── common                           # utility modules
│   ├── config                           # configuration loading
│   ├── rules                            # core rules
│   └── index.js                         # lib entry point
├── scripts                              # scripts for automating tasks
├── test                                 # unit tests
└── solhint.js                           # bin entry point
```

## How solhint Works

### How to Add A New Rule

The Solhint rules in `lib/rules` contains the different lint requirements, such as naming, best practices, security, etc.

The rules are implemented with a [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern). You can extend the `BaseChecker` class with the `ruleId` and `meta` fields to define a rule, and implement methods that are called when a node in the AST is entered or exited. The constructor accepts a reporter and a config, and `ruleId` field is present in the object. This `ruleId` is the one that will be used to activate and configure the rule.

Developers of new rules need to have a basic understanding about the concepts and structure of the AST, and execute the proper logic when certain nodes in the AST are visited.

### How to Add a Plugin

You can write your own plugins to add new rules to Solhint. A plugin is just an npm packages that exports an array of new rules. The name of the package has to follow the naming convention of `solhint-plugin-<plugin-name>`.

Read [this document](https://github.com/protofire/solhint/blob/master/docs/writing-plugins.md) to learn more about writing plugins.


### How to Add Shared Configuration

Shareable configs are configurations that you can use and extend from. They can be useful for using the same base configuration in all your projects or for basing your configuration from a well-known one.

You can either use a shared configuration from `solhint` or from a npm package with the naming convention `solhint-config-<config-name>`.

Read [this document](https://github.com/protofire/solhint/blob/master/docs/shareable-configs.md) to learn more about shared configurations.


## How to Contribute

Solhint is an open source project, and you can follow the [instructions here](https://github.com/protofire/solhint/blob/master/docs/contributing.md) to contribute.

Thanks for your contribution to Solhint.

### Update Rules Doc

To update the rules docs after adding new rules, run one of the commands below:

- Update all rule docs and rule index pages

`./scripts/generate-rule-docs.js or npm run docs`

- Update rule doc for specific rule

`./scripts/generate-rule-docs.js --rule-id no-spaces-before-semicolon or npm run docs -- --rule-id no-spaces-before-semicolon`
