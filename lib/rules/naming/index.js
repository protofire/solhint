const ConstNameSnakecaseChecker = require('./const-name-snakecase')
const ContractNameCamelcaseChecker = require('./contract-name-camelcase')
const EventNameCamelcaseChecker = require('./event-name-camelcase')
const FuncNameMixedcaseChecker = require('./func-name-mixedcase')
const FuncParamNameMixedcaseChecker = require('./func-param-name-mixedcase')
const ModifierNameMixedcaseChecker = require('./modifier-name-mixedcase')
const PrivateVarsLeadingUnderscore = require('./private-vars-leading-underscore')
const UseForbiddenNameChecker = require('./use-forbidden-name')
const VarNameMixedcaseChecker = require('./var-name-mixedcase')
const NamedParametersMapping = require('./named-parameters-mapping')
const ErrorNameMixedcaseChecker = require('./custom-error-name-camelcase')
const PrivateFuncLeadingUnderscoreChecker = require('./private-func-leading-underscore')
const PrivateVarsNoLeadingUnderscoreChecker = require('./private-vars-no-leading-underscore')

module.exports = function checkers(reporter, config) {
  return [
    new ConstNameSnakecaseChecker(reporter, config),
    new ContractNameCamelcaseChecker(reporter),
    new EventNameCamelcaseChecker(reporter),
    new FuncNameMixedcaseChecker(reporter),
    new FuncParamNameMixedcaseChecker(reporter),
    new ModifierNameMixedcaseChecker(reporter),
    new PrivateVarsLeadingUnderscore(reporter, config),
    new UseForbiddenNameChecker(reporter),
    new VarNameMixedcaseChecker(reporter, config),
    new NamedParametersMapping(reporter),
    new ErrorNameMixedcaseChecker(reporter),
    new PrivateFuncLeadingUnderscoreChecker(reporter),
    new ErrorNameMixedcaseChecker(reporter),
    new PrivateVarsNoLeadingUnderscoreChecker(reporter)
  ]
}
