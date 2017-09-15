

module.exports = {

    isMixedCase (text) {
        return text.replace(/[a-z]+[a-zA-Z0-9]*/, '').length === 0;
    },

    isNotMixedCase (text) {
        return !this.isMixedCase(text);
    }

};