const SolidityListener = require('./grammar/SolidityListener').SolidityListener;


class SecurityErrorListener extends SolidityListener {

    constructor(checkers) {
        super();
        this.listenersMap = { };

        checkers.forEach(i => this.addChecker(i));
    }

    addChecker(newChecker) {
        const methods = Object.getOwnPropertyNames(newChecker.__proto__);
        const listenerMethods = new Set(Object.getOwnPropertyNames(SolidityListener.prototype));

        const usedListenerMethods = methods
            .filter(i => i !== 'constructor')
            .filter(i => listenerMethods.has(i));

        usedListenerMethods.forEach(methodName =>
            this.addNewListener(methodName, newChecker)
        );

        usedListenerMethods.forEach(methodName =>
            this[methodName] = this.notifyListenersOn(methodName)
        );
    }

    listenersFor(name) {
        return this.listenersMap[name] || [];
    }

    addNewListener(methodName, checker) {
        const method = checker[methodName].bind(checker);
        const listeners = this.listenersFor(methodName);
        this.listenersMap[methodName] = listeners.concat(method);
    }

    notifyListenersOn(methodName) {
        return (ctx) => this.listenersFor(methodName).forEach(fn => fn(ctx));
    }

}


module.exports = SecurityErrorListener;