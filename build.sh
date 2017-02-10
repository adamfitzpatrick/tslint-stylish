#!/usr/bin/env bash

npm install
gulp prod

EXITSTATUS=$?

npm run tslint-test

exit $EXITSTATUS