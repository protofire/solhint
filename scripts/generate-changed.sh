#!/bin/sh

changed() {
  git diff-index --name-only -B -R -M -C HEAD lib/rules
  git ls-files -t -o -m lib/rules
}

if [ "$(changed)" != "" ]; then
  npm run generate-rulesets
  npm run docs
fi
