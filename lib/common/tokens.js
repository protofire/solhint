const _ = require('lodash');


function tokens(ctx) {
    let curCtx = ctx;
    while (curCtx && curCtx.parentCtx && !curCtx.parser) {
        curCtx = curCtx.parentCtx;
    }

    return curCtx.parser._input.tokens;
}


function prevToken(ctx) {
    const tokenList = tokens(ctx);
    const tokenIndex = _.sortedIndexBy(tokenList, startOf(ctx), _.property('start'));

    let prevTokenIndex = tokenIndex - 1;
    while (prevTokenIndex >= 0 && tokenList[prevTokenIndex].channel !== 0) {
        prevTokenIndex -= 1;
    }

    return tokenList[prevTokenIndex];
}


function nextToken(ctx) {
    const tokenList = tokens(ctx);
    const tokenIndex = _.sortedIndexBy(tokenList, stopOf(ctx), _.property('start'));

    let nextTokenIndex = tokenIndex + 1;
    while (nextTokenIndex < tokenList.length && tokenList[nextTokenIndex].channel !== 0) {
        nextTokenIndex += 1;
    }

    return tokenList[nextTokenIndex];
}


function hasNoSpaceAfter(ctx) {
    return noSpaces(nextToken(ctx), stopOf(ctx));
}


function hasNoSpacesBefore(ctx) {
    return noSpaces(startOf(ctx), prevToken(ctx));
}


function hasSpaceBefore(ctx) {
    return hasSpace(startOf(ctx), prevToken(ctx));
}


function hasSpaceAfter(ctx) {
    return hasSpace(nextToken(ctx), stopOf(ctx));
}


function noSpaces(token1, token2) {
    return hasDiff(token1, token2, 1);
}


function hasSpace(token1, token2) {
    return hasDiff(token1, token2, 2);
}


function hasDiff(token1, token2, indent) {
    return token1.start - token2.stop === indent || !onSameLine(token1, token2);
}


function onSameLine(token1, token2) {
    return token1.line === token2.line;
}


function startOf(ctx) {
    return ctx.start || ctx.symbol;
}


function stopOf(ctx) {
    return ctx.stop || ctx.symbol;
}


function columnOf(ctx) {
    return startOf(ctx).column;
}


function lineOf(ctx) {
    return startOf(ctx).line;
}


function stopLine(ctx) {
    return stopOf(ctx).line;
}


module.exports = {
    hasNoSpaceAfter,
    hasNoSpacesBefore,
    hasSpaceAfter,
    hasSpaceBefore,
    onSameLine,
    prevToken,
    startOf,
    stopOf,
    columnOf,
    lineOf,
    stopLine
};