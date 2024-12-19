## Setting up Git Hooks

After cloning the repository, set up the pre-commit hook by running the following commands:

`git config --unset core.hooksPath`
To reset the hooks config to git default 

```sh
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo '#!/bin/sh\nnode scripts/check-changes.js' > .git/hooks/pre-commit