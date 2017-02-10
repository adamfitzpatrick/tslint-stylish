/*
var assert = require("assert");
var fs = require("fs");

import StylishFormatter = require("../src/stylishFormatter");
import support = require("./support");

var Formatter = StylishFormatter.Formatter;
var TestConstants = support.TestConstants;

class StylishFormatterSpecs {
    private nextTest: () => void;

    public run(nextTest?: () => void) {
        if (nextTest) { this.nextTest = nextTest; }

        describe("stylishFormatter", () => {
            var formatter;
            beforeEach(() => {
                formatter = new Formatter();
            });

            after(() => {
                this.tearDown();
            });

            it("outputs properly formatted stylish data", () => {
                var report = formatter.format(TestConstants.LINTOUTPUT);
                var formattedOutput = TestConstants.FORMATTEDOUTPUT;
                var expected = formattedOutput.noFile +
                    formattedOutput.contentSorted + formattedOutput.count;
                assert.equal(expected, report);
            });
        });
    }

    public tearDown = (): void => {
        if (this.nextTest) { this.nextTest(); }
    };
}

export = StylishFormatterSpecs;
*/