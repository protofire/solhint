## Setting up Git Hooks

After cloning the repository, set up the pre-commit hook by running the following commands:

```sh
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo '#!/bin/sh\nnode scripts/check-changes.js' > .git/hooks/pre-commit