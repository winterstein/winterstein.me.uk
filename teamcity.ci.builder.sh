#!/bin/bash
ssh winterwell@bailey.good-loop.com bash <<EOF 
/home/winterwell/config/build-scripts/builder.sh \
BUILD_TYPE="CI" \
PROJECT_NAME="winterstein.me" \
BRANCH_NAME="master" \
NAME_OF_SERVICE="winterstein.me" \
GIT_REPO_URL="github.com:good-loop/winterstein.me" \
PROJECT_ROOT_ON_SERVER="/home/winterwell/winterstein.me" \
PROJECT_USES_BOB="no" \
PROJECT_USES_NPM="no" \
PROJECT_USES_WEBPACK="no" \
PROJECT_USES_JERBIL="no" \
PROJECT_USES_WWAPPBASE_SYMLINK="no"
EOF