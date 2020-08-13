const ConstNameSnakecaseChecker = require('./const-name-snakecase')
const ContractNameCamelcaseChecker = require('./contract-name-camelcase')
const EventNameCamelcaseChecker = require('./event-name-camelcase')
const FuncNameMixedcaseChecker = require('./func-name-mixedcase')
const FuncParamNameMixedcaseChecker = require('./func-param-name-mixedcase')
const ModifierNameMixedcaseChecker = require('./modifier-name-mixedcase')
const PrivateVarsLeadingUnderscore = require('./private-vars-leading-underscore')
const UseForbiddenNameChecker = require('./use-forbidden-name')
const VarNameMixedcaseChecker = require('./var-name-mixedcase')

module.exports = function checkers(reporter, config) {
  return [
    new ConstNameSnakecaseChecker(reporter),
    new ContractNameCamelcaseChecker(reporter),
    new EventNameCamelcaseChecker(reporter),
    new FuncNameMixedcaseChecker(reporter),
    new FuncParamNameMixedcaseChecker(reporter),
    new ModifierNameMixedcaseChecker(reporter),
    new PrivateVarsLeadingUnderscore(reporter, config),
    new UseForbiddenNameChecker(reporter),
    new VarNameMixedcaseChecker(reporter)
  ]
}
