const ConstructorSyntax = require('./constructor-syntax');
const EmitEventSyntax = require('./emit-event-syntax');

module.exports = (reporter) => [
    new ConstructorSyntax(reporter),
    new EmitEventSyntax(reporter)
];
