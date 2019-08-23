const { funcWith } = require('./../../common/contract-builder')

module.exports = [funcWith('var (a, b,) = test1.test2(); a + b;'), funcWith('test(1, 2, b);')]
