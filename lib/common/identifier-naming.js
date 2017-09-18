

module.exports = {

    isMixedCase (text) {
        return text.replace(/[a-z]+[a-zA-Z0-9$]*/, '').length === 0;
    },

    isNotMixedCase (text) {
        return !this.isMixedCase(text);
    },

    isCamelCase (text) {
        return text.replace(/[A-Z]+[a-zA-Z0-9$]*/, '').length === 0;
    },

    isNotCamelCase (text) {
        return !this.isCamelCase(text);
    }

};