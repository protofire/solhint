## Setting up Git Hooks

After cloning the repository, set up the pre-commit hook by running the following commands:

First, reset the hooks config to git default:

```sh
git config --unset core.hooksPath
```

Then create and configure the pre-commit hook:

```sh
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
printf '#!/bin/sh\nnode scripts/check-changes.js\n' > .git/hooks/pre-commit
```

This hook will run checks before each commit to ensure code quality.
