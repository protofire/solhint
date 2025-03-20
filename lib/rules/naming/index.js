const ConstNameSnakecaseChecker = require('./const-name-snakecase')
const ContractNameCapWordsChecker = require('./contract-name-capwords')
const EventNameCapWordsChecker = require('./event-name-capwords')
const FuncNameMixedcaseChecker = require('./func-name-mixedcase')
const FuncParamNameMixedcaseChecker = require('./func-param-name-mixedcase')
const ModifierNameMixedcaseChecker = require('./modifier-name-mixedcase')
const PrivateVarsLeadingUnderscoreChecker = require('./private-vars-leading-underscore')
const UseForbiddenNameChecker = require('./use-forbidden-name')
const VarNameMixedcaseChecker = require('./var-name-mixedcase')
const NamedParametersMappingChecker = require('./named-parameters-mapping')
const ImmutableVarsNamingChecker = require('./immutable-vars-naming')
const FunctionNamedParametersChecker = require('./func-named-parameters')
const FoundryTestFunctionsChecker = require('./foundry-test-functions')

module.exports = function checkers(reporter, config) {
  return [
    new ConstNameSnakecaseChecker(reporter),
    new ContractNameCapWordsChecker(reporter),
    new EventNameCapWordsChecker(reporter),
    new FuncNameMixedcaseChecker(reporter),
    new FuncParamNameMixedcaseChecker(reporter),
    new ModifierNameMixedcaseChecker(reporter),
    new PrivateVarsLeadingUnderscoreChecker(reporter, config),
    new UseForbiddenNameChecker(reporter),
    new VarNameMixedcaseChecker(reporter),
    new NamedParametersMappingChecker(reporter),
    new ImmutableVarsNamingChecker(reporter, config),
    new FunctionNamedParametersChecker(reporter, config),
    new FoundryTestFunctionsChecker(reporter, config),
  ]
}
