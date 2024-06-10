#!/usr/bin/env bash

set -euo pipefail

DEPLOY_PATH="/var/www/odysseus/admin-story/"
SOURCE_PATH="build/"

CI=false npm run build:live

rsync -avzr --delete "$SOURCE_PATH" "$DEPLOY_PATH"
echo "Deployed to $DEPLOY_PATH"

