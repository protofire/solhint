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





<br><br>
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





<br><br>
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
