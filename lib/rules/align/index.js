const NoMixTabAndSpacesChecker = require('./no-mix-tabs-and-spaces');
const IndentChecker = require('./indent');
const BracketsAlign = require('./brackets-align');
const ArrayDeclarationChecker = require('./array-declaration');
const ExpressionAlignChecker = require('./expression-align');
const StatementsAlignChecker = require('./statements-align');
const SpaceAfterCommaChecker = require('./space-after-comma');
const NoSpacesBeforeSemicolonChecker = require('./no-spaces-before-semicolon');


module.exports = function checkers(reporter, config) {
    return [
        new NoMixTabAndSpacesChecker(reporter, config),
        new IndentChecker(reporter, config),
        new BracketsAlign(reporter),
        new ArrayDeclarationChecker(reporter),
        new ExpressionAlignChecker(reporter),
        new StatementsAlignChecker(reporter),
        new SpaceAfterCommaChecker(reporter),
        new NoSpacesBeforeSemicolonChecker(reporter)
    ];
};
