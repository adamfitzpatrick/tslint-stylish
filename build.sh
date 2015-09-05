#!/usr/bin/env bash

npm install
gulp prod

EXITSTATUS=$?

npm install tslint -g
tslint specs/fixtures/TestSrc.ts -s . -t stylish

exit $EXITSTATUS