## [5.0.5] - 2025-01-16
### Fixed
- `gas-custom-errors` [#620](https://github.com/protofire/solhint/pull/620) - Support for Custom Errors inside `require` statements
- `compiler-version` [#621](https://github.com/protofire/solhint/pull/621) - Upgraded minimum requirement for the rule
- `reentrancy` [#622](https://github.com/protofire/solhint/pull/622) - Fixed path and typos 
- Typos [#623](https://github.com/protofire/solhint/pull/623) - Fixed typos 
- Typo [#625](https://github.com/protofire/solhint/pull/625) - Fixed typo 


### Added
- New Rule: Duplicated Imports [#626](https://github.com/protofire/solhint/pull/626)
- Cute Message on console report to gather community into discord channel
  
<br><br>


## [5.0.4] - 2024-12-31
### Fixed
- `imports-order` [#595](https://github.com/protofire/solhint/pull/595) - Replaced single quotes with double quotes
- `gas-custom-errors` [#613](https://github.com/protofire/solhint/pull/613) - Allows the use of Requirement with Custom Errors
- Typos and broken links [#611](https://github.com/protofire/solhint/pull/611) - [#617](https://github.com/protofire/solhint/pull/617)
- Upgraded `solidity-parser` dependency [#612](https://github.com/protofire/solhint/pull/612) 


### Added
- `.pre-commit-hooks.yaml` to allow projects to run Solhint via pre-commit [#596](https://github.com/protofire/solhint/pull/596) (Thanks to [@dbast](https://github.com/dbast))
- Removed `husky` since it is not needed [#612](https://github.com/protofire/solhint/pull/612)
  
<br><br>


## [5.0.3] - 2024-08-03
### Fixed
- `imports-order` [#593](https://github.com/protofire/solhint/pull/593)
  
<br><br>

## [5.0.2] - 2024-07-25
### Fixed
- `func-named-parameters` exclude abi.encodeX from the rule [#583](https://github.com/protofire/solhint/pull/583) (Thanks to [@0xCLARITY](https://github.com/0xCLARITY))
- Several typos in comments [#586](https://github.com/protofire/solhint/pull/586) (Thanks to [@dropbigfish](https://github.com/dropbigfish))

### Added
- New Rule: Imports order [#587](https://github.com/protofire/solhint/pull/587)
  
<br><br>

## [5.0.1] - 2024-05-13
### BREAKING CHANGES (refer to v5.0.0)
Fixed an issue on the returning values where only was evaluating the first report instead of all of them.


<br><br>

## [5.0.0] - 2024-05-11
### BREAKING CHANGES

#### Solhint EXIT codes
Solhint changed how the exit codes are implemented:

`Exit with 0 code` When execution was ok and there were no errors when evaluating the code according to the rules<br>
`Exit with 1 code` When execution was ok and there are errors reported<br>
`Exit with 1 code` When execution was ok and max warnings is lower than the reported warnings<br>
`Exit with 255 code` When there's an error in the execution (bad config, writing not allowed, wrong parameter, file not found, etc)<br>

#### Solhint QUIET mode
QUIET mode (-c quiet) option now works with the warnings and may exit with 1 if there are more than defined by user

Thanks to [@juanpcapurro](https://github.com/juanpcapurro) for providing the code

<br><br>

## [4.5.4] - 2024-04-10
### Fixed
- `gas-custom-errors` improved logic to ranged pragma versions [#573](https://github.com/protofire/solhint/pull/573)
- `gas-indexed-events`  [#573](https://github.com/protofire/solhint/pull/573)


## [4.5.2] - 2024-03-15

### Updated
- Update Readme file to include all autofix rules
- Update docker file 
- Update package json file



## [4.5.0] - 2024-03-15

### Updated
- Update dependencies in package json [#548](https://github.com/protofire/solhint/pull/548)
- Custom errors rules checks from 0.8.4 forward before warning [#555](https://github.com/protofire/solhint/pull/555)
- Parser support up to Solidity 0.8.22 (*)

(*) Note: Solhint can work with latest Solidity versions. 
          If new grammar/syntax is added or changed, it could give some false positives or miss a rule. 
          But overall functionality will work as expected.


### Added
- New Rule: Interface starts with `i` [#557](https://github.com/protofire/solhint/pull/557)

#### Gas Consumption Rules
- New Rule: [GC] Multitoken1155 rule [#541](https://github.com/protofire/solhint/pull/541)
- New Rule: [GC] Small strings check [#542](https://github.com/protofire/solhint/pull/542)
- New Rule: [GC] Indexed events [#543](https://github.com/protofire/solhint/pull/543)
- New Rule: [GC] Calldata parameters [#544](https://github.com/protofire/solhint/pull/544)
- New Rule: [GC] Increment by one [#545](https://github.com/protofire/solhint/pull/545)
- New Rule: [GC] Struct packing [#546](https://github.com/protofire/solhint/pull/546)
- New Rule: [GC] Name Return Values [#552](https://github.com/protofire/solhint/pull/552)
- New Rule: [GC] Custom Errors #553 [#555](https://github.com/protofire/solhint/pull/553)
- New Rule: [GC] Dot Length in Loops [#559](https://github.com/protofire/solhint/pull/559)
- New Rule: [GC] Gas Strict Inequalities [#560](https://github.com/protofire/solhint/pull/560)


### Fixed
- `explicit-types` logic improved and bug free [#551](https://github.com/protofire/solhint/pull/551)
- `payable fallback`  Improved behavior [#561](https://github.com/protofire/solhint/pull/561)



### BREAKING CHANGES
- `named-return-values` rule was renamed to gas-named-return-values and now it is part of Gas Consumption ruleset [#552](https://github.com/protofire/solhint/pull/552)
- `custom-errors` rule was renamed to gas-custom-errors and now it is part of Gas Consumption ruleset [#553](https://github.com/protofire/solhint/pull/553)
- Return error 0 when executed correctly [#554](https://github.com/protofire/solhint/pull/554)
- Default severity modified to `WARN` instead of `OFF` for 
  `foundry-test-functions` and `named-parameters-mapping` rules [#556](https://github.com/protofire/solhint/pull/556)




## [4.1.1] - 2024-01-08

### Fixed
- Fix changelog typos


## [4.1.0] - 2024-01-08

### Updated
- Included `Sarif` formatter [#530](https://github.com/protofire/solhint/pull/530) (Thanks to [@eshaan7](https://github.com/eshaan7))
- Cache `npm` on workflows [#534](https://github.com/protofire/solhint/pull/534)


### Added
- Official Docker Image [#524](https://github.com/protofire/solhint/pull/524) (Thanks to [@keypee](https://github.com/keypee90))
- Autofix for `payable-fallback` rule [#528](https://github.com/protofire/solhint/pull/528)
- Autofix for `quotes` rule [#529](https://github.com/protofire/solhint/pull/529)
- Autofix for `avoid-suicide` rule [#531](https://github.com/protofire/solhint/pull/531)
- Autofix for `contract-name-camelcase` rule [#532](https://github.com/protofire/solhint/pull/532)
- Autofix for `event-name-camelcase` rule [#533](https://github.com/protofire/solhint/pull/533)

### Fixed
- Fix private vars leading underscore on libraries [#525](https://github.com/protofire/solhint/pull/525)

 


## [4.0.0] - 2023-10-01

### Updated
- Enhance explicit types sensitivity [#493](https://github.com/protofire/solhint/pull/493) (Thanks to [@vladyan18](https://github.com/vladyan18))
- Docs on `private-vars-leading-underscore` rule to clarify its functionality
- Changelog and docs for `no-empty-blocks` rule to clarify its functionality
- Require package with full path [#515](https://github.com/protofire/solhint/pull/515) (Thanks to [@zouguangxian](@https://github.com/zouguangxian))

### Added
- Check for updates on Solhint version to keep users up to date. There's an option to disable this check (`--disc`) [#506](https://github.com/protofire/solhint/pull/506)
- `fix` option now shows the report on screen [#509](https://github.com/protofire/solhint/pull/509)
- `save` option to store report on disk with the standard or the specified format [#509](https://github.com/protofire/solhint/pull/509) 
- Autofix for `explicit-types` rule [#504](https://github.com/protofire/solhint/pull/504)
- Autofix for `no-console` rule [#513](https://github.com/protofire/solhint/pull/513)
- Autofix for `private-vars-leading-underscore` rule [#511](https://github.com/protofire/solhint/pull/511)

### Fixed
- Generate docs script on Windows OS [#494](https://github.com/protofire/solhint/pull/494) (Thanks to [@vladyan18](https://github.com/vladyan18))
- `one-contract-per-file` ignore interfaces [#514](https://github.com/protofire/solhint/pull/514) (Thanks to [@cruzdanilo](https://github.com/cruzdanilo))

 


## [3.6.2] - 2023-08-17
### Added
- New Rule: `one-contract-per-file` - Enforces the use of ONE contract per file [#487](https://github.com/protofire/solhint/pull/487)

  
### Fixed
- `foundry-test-functions` - Modified regex to include invariant and statefulFuzz tests [#484](https://github.com/protofire/solhint/pull/484)
- `quotes` - To allow quotes inside double quotes and vice versa [#485](https://github.com/protofire/solhint/pull/485)
- `JSON` - Formatter returning JS object instead of standard json [#490](https://github.com/protofire/solhint/pull/490) 



## [3.6.1] - 2023-08-11

### BREAKING CHANGE
- RULE: `not-rely-on-time` was REMOVED from RECOMMENDED ruleset<br>
This was long overdue.<br> 
Beware!! If you are relying on this rule and it is not explicitly configured (meaning there's only `solhint:recommended` option).<br>
You should add this rule manually:
```json
  {
    "extends": "solhint:recommended",
    "rules": { 
        "not-rely-on-time": "warn", 
        "compiler-version": "off" 
    },
  }
```
If not explicitly added, this rule will not be executed.

### SPECIAL ATTENTION
- RULE: `compiler-version` default was updated from ^0.5.2 to ^0.8.0


### Updated
- Rule: `check-send-result` added config clarification in the new `Notes` section [#482](https://github.com/protofire/solhint/pull/482)
- Rule: `compiler-version` default was updated from ^0.5.2 to ^0.8.0 [#483](https://github.com/protofire/solhint/pull/483)

### Added
- New Rule: Enforces the use of Custom Errors over Require and Revert statements [#475](https://github.com/protofire/solhint/pull/475)
- New Rule: Enforces the test_ prefix on a file for Foundry users [#476](https://github.com/protofire/solhint/pull/476)
- New Rule: Enforces the naming of function return values [#478](https://github.com/protofire/solhint/pull/478)
- `Notes` option on docs to add more information of each rule. See `foundry-test-functions`. [#476](https://github.com/protofire/solhint/pull/476)

### Fixed
- `func-named-parameters` - false positives on builtin functions [#472](https://github.com/protofire/solhint/pull/472)
- `ordering` - treat initializer weight same as constructor [#474](https://github.com/protofire/solhint/pull/474)
- `check-send-result` - false positive on `erc777.send()`` function [#477](https://github.com/protofire/solhint/pull/477)
- `explicit-types` - default value is now taking into account when no value is specified in config [#481](https://github.com/protofire/solhint/pull/481)
- `compiler-version` - default value is now taking into account when no value is specified in config [#483](https://github.com/protofire/solhint/pull/483)




## [3.5.1] - 2023-08-04
### Updated
- Ignores empty constructors when inheriting a base contract [#418](https://github.com/protofire/solhint/pull/418)
- Bump json5 from 2.1.3 to 2.2.3 [#376](https://github.com/protofire/solhint/pull/376)
- Bump json-schema and jsprim [#370](https://github.com/protofire/solhint/pull/370)
- Bump semver from 6.3.0 to 7.5.2 [#438](https://github.com/protofire/solhint/pull/438)
- Corrected "Category" of `quotes` rule, added default rules list on readme [#443](https://github.com/protofire/solhint/pull/443)
- 'Deprecated' column on `rules.md`` [#444](https://github.com/protofire/solhint/pull/444)
- Information about maxCharacters allowed on `reason-string` rule [#446](https://github.com/protofire/solhint/pull/446)
- E2E tests for `max-warnings` [#455](https://github.com/protofire/solhint/pull/455)
- Replaced blacklist and whitelist words [#459](https://github.com/protofire/solhint/pull/459)
- Removed runtime dependencies on load-rules [#462](https://github.com/protofire/solhint/pull/462)
- Allowed $ symbol as part of naming [#465](https://github.com/protofire/solhint/issues/465)
- Disabled `no-empty-blocks` rule for receive() function [#466](https://github.com/protofire/solhint/pull/466)
  
### Added
- New Rule: No unused imports [#417](https://github.com/protofire/solhint/pull/417)
- New Rule: To treat immutable as constants [#458](https://github.com/protofire/solhint/pull/458)
- New Rule: Explicit-types. To forbid/enforce full type or alias for variables declaration [#467](https://github.com/protofire/solhint/pull/467)
- New Rule: Naming of Function parameters. Enforce arguments naming [#468](https://github.com/protofire/solhint/pull/468)
- JSON formatter support [#440](https://github.com/protofire/solhint/pull/440)
- Rules List with `list-rules` command [#449](https://github.com/protofire/solhint/pull/449)
- E2E tests for formatters and new `Compact formatter` [#457](https://github.com/protofire/solhint/pull/457)

### Fixed
- `maxWarnings` parameter waiting review [#439](https://github.com/protofire/solhint/pull/439)
- `–fix` option not working in avoid-throw rule [#442](https://github.com/protofire/solhint/pull/442)
- Formatter option fixed for `stdin` command [#450](https://github.com/protofire/solhint/pull/450)



## [3.4.1] - 2023-03-06
### Updated
- Updated solidity parser to 0.16.0 [#420](https://github.com/protofire/solhint/pull/420)

### Added
- Added github workflow to execute unit tests on each PR [#412](https://github.com/protofire/solhint/pull/412)
- Added macOS and windows into E2E github workflow [#422](https://github.com/protofire/solhint/pull/422)

### Fixed
- False positive on for-loop Yul [#400](https://github.com/protofire/solhint/pull/400)
- Ordering-rule support for Top Level statements [#393](https://github.com/protofire/solhint/pull/393)
- Fix no-global-import to accept named global imports [#416](https://github.com/protofire/solhint/pull/416)
- Fix named-parameters-mapping to not enforce on nested mappings [#421](https://github.com/protofire/solhint/pull/421)


## [3.4.0] - 2023-02-17
### Updated
- Solhint dependencies to support newer versions [#380](https://github.com/protofire/solhint/pull/380)
- Linter fixed to get clearer source code [#381](https://github.com/protofire/solhint/pull/381)
- E2E, added formatters into repo, updated CI [#385](https://github.com/protofire/solhint/pull/385)
- Solhint dependencies to support newer versions [#403](https://github.com/protofire/solhint/pull/403)
  
### Added
- New Rule: For banning "console.sol" and "import hardhat or foundry console.sol" [#372](https://github.com/protofire/solhint/pull/372)
- New Rule: No global imports [#390](https://github.com/protofire/solhint/pull/390)
- New Rule: Named parameters in v0.8.18 solidity version [#403](https://github.com/protofire/solhint/pull/403)

### Fixed
- TypeError: cannot read property 'errorCount' of undefined [#351](https://github.com/protofire/solhint/pull/351)
- Directories with .sol in the name path treated as files [#352](https://github.com/protofire/solhint/pull/388)
- Doc generator and added a CI step to avoid crashing [#389](https://github.com/protofire/solhint/pull/389)
- Rule for banning "console.sol" and "import hardhat or foundry console.sol [#391](https://github.com/protofire/solhint/pull/391)
- Option –quiet works now with all files [#392](https://github.com/protofire/solhint/pull/392)
- Transfers with .call excluded from warning as low level code [#394](https://github.com/protofire/solhint/pull/394)
- Made func-visibility skip free functions [#396](https://github.com/protofire/solhint/pull/396)
- False positive on no-unused-vars for payable arguments without name [#399](https://github.com/protofire/solhint/pull/399)


## [3.3.8] - 2023-01-17
### Fixed Docs and Typos
- [#292](https://github.com/protofire/solhint/pull/292)
- [#343](https://github.com/protofire/solhint/pull/343)
- [#355](https://github.com/protofire/solhint/pull/355)
- [#285](https://github.com/protofire/solhint/pull/285)
  

### Updated
- Solidity Parser to 0.14.5 [#330](https://github.com/protofire/solhint/pull/330) - [#378](https://github.com/protofire/solhint/pull/378)


<br><br>
## TIME GAP
## [2.1.0] - 2019-05-30

### Added

- New `compiler-version` rule (see PR #112)

### Fixed

- Several fixes for the `mark-callable-contracts` rule (PRs #115, #117 and #119)

## [2.0.0] - 2019-02-15

Stable release

## [2.0.0-beta.1] - 2019-01-31
### Fixed
- Fix linter errors

## [2.0.0-alpha.3] - 2019-01-23
### Changed
- Update config initializer [#103](https://github.com/protofire/solhint/pull/103) 

## [2.0.0-alpha.2] - 2019-01-08
### Changed
- Remove prettier from rule

## [2.0.0-alpha.1] - 2019-01-08
### Fixed
- Package version

## [2.0.0-alpha.0] - 2019-01-08
### Added
- Add rulesets [#73](https://github.com/protofire/solhint/issues/73)
- Add plugins support [#99](https://github.com/protofire/solhint/pull/99)
- Update docs

## [1.5.0] - 2018-12-26
### Added
- Add not-rely-on-time to rules documentation [#88](https://github.com/protofire/solhint/pull/88)
- Have --max-warnings better reflect its name [#89](https://github.com/protofire/solhint/pull/89)
- Added disable-previous-line [#91](https://github.com/protofire/solhint/pull/91)
- Snake case now allows for a (single) leading underscore [#93](https://github.com/protofire/solhint/pull/93)

### Fixed
- Fixed some comment directive tests [#92](https://github.com/protofire/solhint/pull/92)

## [1.4.1] - 2018-12-10
### Added
- Allow to specify the path to the config file [#78](https://github.com/protofire/solhint/issues/78)
- Roadmap and changelog [#81](https://github.com/protofire/solhint/issues/81)

### Changed
- Upgrade grammar [#79](https://github.com/protofire/solhint/pull/79)

## [1.4.0] - 2018-10-10
### Added
- Support prettier-solidity [#72](https://github.com/protofire/solhint/pull/72)

## [1.3.0] - 2018-09-25
### Added
- Add "Projects that use solhint" to README.md file [#64](https://github.com/protofire/solhint/issues/63)
- Add prettier and airbnb [#59](https://github.com/protofire/solhint/issues/59)
- Add new feature --ignore-path option [#58](https://github.com/protofire/solhint/issues/58)
- Add contribution formatter parameter validation [#54](https://github.com/protofire/solhint/pull/54)
- Add --max-warnings [int] option [#56](https://github.com/protofire/solhint/issues/56)
- Add --quiet option [#55](https://github.com/protofire/solhint/pull/55)

### Changed
- Move rules sections out from README.md [#65](https://github.com/protofire/solhint/issues/65)
- Complete docs and readme [#61](https://github.com/protofire/solhint/issues/61)

### Fixed
- Unable to satisfy indentation rules for functions with multiple return values [#49](https://github.com/protofire/solhint/issues/49)
