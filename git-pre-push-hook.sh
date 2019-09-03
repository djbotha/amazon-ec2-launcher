#!/bin/sh

# This hook is called by "git push" after it has checked the remote status, but
# before anything has been pushed.  If this script exits with a non-zero status
# nothing will be pushed.
#
# This hook is called with the following parameters:
#
# $1 -- Name of the remote to which the push is being done
# $2 -- URL to which the push is being done
#
# If pushing without using a named remote those arguments will be equal.
#
# Information about the commits which are being pushed is supplied as lines to
# the standard input in the form:
#
#   <local ref> <local sha1> <remote ref> <remote sha1>

remote="$1"
url="$2"

ESLINT="$(git rev-parse --show-toplevel)/node_modules/.bin/eslint"

PASS=true

printf "\nValidating Javascript:\n"

# Check for eslint
if [[ ! -x "$ESLINT" ]]; then
  printf "\t\033[41mPlease install ESlint\033[0m (npm install eslint --save-dev)"
  exit 1
fi

npm run lint

if [[ "$?" == 0 ]]; then
  printf "ESLint check passed"
else
  PASS=false
fi

if ! $PASS; then
  exit 1
else
  printf "\033[42mVALIDATION SUCCEEDED\033[0m\n"
fi

exit $?


exit 0
