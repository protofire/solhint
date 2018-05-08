#!/usr/bin/env sh

ANTLR_JAR="antlr4.jar"

if [ ! -e "$ANTLR_JAR" ]; then
  curl http://www.antlr.org/download/antlr-4.7-complete.jar -o "$ANTLR_JAR"
fi

java -jar $ANTLR_JAR -Dlanguage=JavaScript lib/grammar/Solidity.g4

find lib/grammar/ -name '*interp' -delete
