

class CommentDirectiveParser {

    constructor (tokens) {
        this.disableRuleByLine = [];
        this.disableAllByLine = [];
        this.lastLine = tokens.tokenSource.line;

        this.initRulesTable();

        this.parseComments(tokens);
    }

    initRulesTable() {
        for (let i = 1; i <= this.lastLine; i += 1) {
            this.disableRuleByLine[i] = new Set();
            this.disableAllByLine[i] = false;
        }
    }

    parseComments(tokens) {
        const items = tokens.filterForChannel(0, tokens.tokens.length - 1, 1);
        items && items.forEach(this.onComment.bind(this));
    }

    onComment(lexema) {
        const text = lexema.text;
        const curLine = lexema.line;

        if (text.includes('solhint-disable-line')) {
            const rules = this.parseRuleIds(text, 'solhint-disable-line');
            this.disableRules(rules, curLine);
            return;
        }

        if (text.includes('solhint-disable-next-line')) {
            const rules = this.parseRuleIds(text, 'solhint-disable-next-line');

            if (curLine + 1 <= this.lastLine) {
                this.disableRules(rules, curLine + 1);
            }

            return;
        }

        if (text.includes('solhint-disable')) {
            const rules = this.parseRuleIds(text, 'solhint-disable');

            for (let i = curLine; i <= this.lastLine; i += 1) {
                this.disableRules(rules, i);
            }

            return;
        }

        if (text.includes('solhint-enable')) {
            const rules = this.parseRuleIds(text, 'solhint-enable');

            for (let i = curLine; i <= this.lastLine; i += 1) {
                this.enableRules(rules, i);
            }
        }
    }

    disableRules(rules, curLine) {
        if (rules === 'all') {
            this.disableAllByLine[curLine] = true;
        } else {
            this.addMultipleRulesToLine(curLine, rules);
        }
    }

    enableRules(rules, curLine) {
        if (rules === 'all') {
            this.disableAllByLine[curLine] = false;
        } else {
            this.removeMultipleRulesFromLine(curLine, rules);
        }
    }

    parseRuleIds(text, start) {
        const ruleIds = text
            .replace('//', '')
            .replace('/*', '')
            .replace('*/', '')
            .replace(start, '');

        const rules = ruleIds
            .split(',')
            .map(curRule => curRule.trim())
            .filter(i => i.length > 0);

        if (rules.length > 0 && rules[0].length > 0) {
            return rules;
        } else {
            return 'all';
        }
    }

    addMultipleRulesToLine(line, rules) {
        rules
            .forEach(curRule =>
                this.disableRuleByLine[line].add(curRule)
            );
    }

    removeMultipleRulesFromLine(line, rules) {
        rules
            .forEach(curRule =>
                this.disableRuleByLine[line].delete(curRule)
            );
    }

    isRuleEnabled(line, ruleId) {
        return !this.disableAllByLine[line] && !this.disableRuleByLine[line].has(ruleId);
    }

}

module.exports = CommentDirectiveParser;
