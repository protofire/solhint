
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

    findDownAllTypes(ctx, type) {
        if (ctx && ctx.constructor.name === type) {
            return [ctx];
        } else if (ctx && ctx.children) {
            let items = ctx
                .children
                .reduce(i => this.findDownAllTypes(i, type));

            return items.length > 0 && items[0] || null;
        } else {
            return [];
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

}


module.exports = TreeTraversing;