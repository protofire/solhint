
class TreeTraversing {

    statementNotContains(ctx, type) {
        let statement = this.findParentStatement(ctx);

        if (!statement) {
            return false;
        }

        let itemOfType = this.findDownType(statement, type);

        return itemOfType !== null;
    }

    findParentStatement(ctx) {
        while (ctx.parentCtx != null && ctx.parentCtx.constructor.name !== 'StatementContext') {
            ctx = ctx.parentCtx;
        }

        return ctx.parentCtx;
    }

    findParentType(ctx, type) {
        while (ctx.parentCtx != null && ctx.parentCtx.constructor.name !== type) {
            ctx = ctx.parentCtx;
        }

        return ctx.parentCtx;
    }

    findDownType(ctx, type) {
        if (!ctx || ctx.constructor.name === type) {
            return ctx;
        } else if (ctx.children) {
            let items = ctx
                .children
                .map(i => this.findDownType(i, type))
                .filter(i => i !== null);

            return items.length > 0 && items[0] || null;
        } else {
            return null;
        }
    }

    findDown(ctx, nesting, itemIndex) {
        for (let i = 0; i < nesting - 1; i += 1) {
            ctx = ctx.getChild(0);

            if (!ctx) {
                return null;
            }
        }

        if (nesting > 0) {
            ctx = ctx.getChild(itemIndex);

            if (!ctx) {
                return null;
            }
        }

        return ctx;
    }

    *findIdentifier(ctx) {
        const children = ctx.children;

        for (let i = 0; i < children.length; i += 1) {
            if (children[i].constructor.name === 'IdentifierContext') {
                yield children[i];
            }
        }

        return null;
    }

}

TreeTraversing.columnOf = function (ctx) {
    if (ctx && ctx.start) {
        return ctx.start.column;
    } else if (ctx && ctx.symbol) {
        return ctx.symbol.column;
    } else {
        return null;
    }
};

TreeTraversing.lineOf = function (ctx) {
    if (ctx && ctx.start) {
        return ctx.start.line;
    } else if (ctx && ctx.symbol) {
        return ctx.symbol.line;
    } else {
        return null;
    }
};

TreeTraversing.stopLine = function (ctx) {
    if (ctx && ctx.stop) {
        return ctx.stop.line;
    } else if (ctx && ctx.symbol) {
        return ctx.symbol.line;
    } else {
        return null;
    }
};


module.exports = TreeTraversing;