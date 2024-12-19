#!/usr/bin/env bash

set -o errtrace -o nounset -o pipefail -o errexit

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# Create temp working directory for mock repo
MOCK_REPO=$(mktemp -d)
if [[ ! "$MOCK_REPO" || ! -d "$MOCK_REPO" ]]; then
	echo "Could not create temp dir"
	exit 1
fi
function cleanup {
	echo "Deleting temp working directory $MOCK_REPO"
	rm -rf "$MOCK_REPO"
}

trap cleanup EXIT

# Filling the mock repo
pushd "$MOCK_REPO" >/dev/null || exit 1
git init --initial-branch=master || { echo "Failed to initialize git repo"; exit 1; }
git config user.email "test@example.com" || { echo "Failed to set git email"; exit 1; }
git config user.name "pre-commit test" || { echo "Failed to set git name"; exit 1; }
if [[ ! -f "$SCRIPT_DIR/.solhint.json" || ! -f "$SCRIPT_DIR/Counter.sol" ]]; then
    echo "Required files are missing in the script directory"
    exit 1
fi
cp "$SCRIPT_DIR/.solhint.json" "$SCRIPT_DIR/Counter.sol" .
git add .
git commit -m "Initial commit"

# Run pre-commit inside the mock repo while referencing the solhint directory, 
# where the .pre-commit-hooks.yaml is located.
pre-commit try-repo "$SCRIPT_DIR/../.." solhint --verbose --color=always --all-files
