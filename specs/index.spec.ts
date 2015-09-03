/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />

import support = require("./support");
var TestConstants = support.TestConstants;
var stylish = require(process.cwd());
var assert = require("assert");
var gulp = require("gulp");
var tslint = require("gulp-tslint");

class IndexSpecs {
    private logInterceptor: support.LogInterceptor;
    private nextTest: () => void;
    private formattedOutput: Object = TestConstants.FORMATTEDOUTPUT;

    constructor() {
        this.logInterceptor = new support.LogInterceptor();
    }

    public run(nextTest?: () => void): void {
        if (nextTest) { this.nextTest = nextTest; }

        describe("release/index.js", () => {

            beforeEach(() => {
                this.logInterceptor.clearLog();
                stylish(TestConstants.LINTOUTPUT, TestConstants.LINTEDFILE);
            });

            after(() => {
                this.tearDown();
            });

            it("provides output as expected for minimum args", () => {
                this.assertAll(this.logInterceptor.getLog(), true, true);
            });

            it("sorts formattedOutput by default and when requested, but not if sort = false", () => {
                this.assertAll(this.logInterceptor.getLog(), true, true);
                this.logInterceptor.clearLog();
                stylish(TestConstants.LINTOUTPUT, TestConstants.LINTEDFILE, { sort: true });
                this.assertAll(this.logInterceptor.getLog(), true, true);
                this.logInterceptor.clearLog();
                stylish(TestConstants.LINTOUTPUT, TestConstants.LINTEDFILE, { sort: false });
                this.assertAll(this.logInterceptor.getLog(), false, true);
            });

            it("emits the system bell by default and when requested, but not if bell = false", () => {
                this.assertAll(this.logInterceptor.getLog(), true, true);
                this.logInterceptor.clearLog();
                stylish(TestConstants.LINTOUTPUT, TestConstants.LINTEDFILE, { bell: true });
                this.assertAll(this.logInterceptor.getLog(), true, true);
                this.logInterceptor.clearLog();
                stylish(TestConstants.LINTOUTPUT, TestConstants.LINTEDFILE, { bell: false });
                this.assertAll(this.logInterceptor.getLog(), true, false);
            });
        });
    }

    public tearDown = (): void => {
        this.logInterceptor.destroy();
        if (this.nextTest) { this.nextTest(); }
    };

    public assertAll(log: string[], sort: boolean, bell: boolean) {
        var formattedOutput = TestConstants.FORMATTEDOUTPUT;
        assert.equal(log[0], formattedOutput.title);
        assert.equal(log[1], sort ? formattedOutput.contentSorted : formattedOutput.contentUnsorted);
        assert.equal(log[2], formattedOutput.count);
        if (bell) {
            assert.equal(log[3], formattedOutput.bell);
        }
    }
}

module.exports = IndexSpecs;
