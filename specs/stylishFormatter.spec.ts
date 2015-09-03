/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />

import support = require("./support");
var TestConstants = support.TestConstants;
var stylishFormatter = require(process.cwd() + "/release/stylishFormatter.js");
var assert = require("assert");
var fs = require("fs");


class StylishFormatterSpecs {
    private nextTest: () => void;

    public run(nextTest?: () => void) {
        if (nextTest) { this.nextTest = nextTest; }

        describe("stylishFormatter", () => {
            var formatter;
            beforeEach(() => {
                formatter = new stylishFormatter.Formatter();
            });

            after(() => {
                this.tearDown();
            });

            it("outputs raw JSON as received", () => {
                var report = formatter.format(TestConstants.LINTOUTPUT);
                assert.equal(JSON.stringify(TestConstants.LINTOUTPUT), report);
            });
        });
    }

    public tearDown = (): void => {
        if (this.nextTest) { this.nextTest(); }
    };
}

module.exports = StylishFormatterSpecs;
