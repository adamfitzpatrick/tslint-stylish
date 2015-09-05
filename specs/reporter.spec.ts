/// <reference path="../typings/stylish.d.ts" />

var stylish = require(process.cwd() + "/compiled/src/index");
var assert = require("assert");
var gulp = require("gulp");
var tslint = require("gulp-tslint");

import Support = require("./support");
import Reporter = require("../src/reporter");
import RuleFailure = require("../src/ruleFailure");

var TestConstants = Support.TestConstants;

class ReporterSpec {
    private logInterceptor: Support.LogInterceptor;
    private nextTest: () => void;

    constructor() {
        this.logInterceptor = new Support.LogInterceptor();
    }

    public run(nextTest?: () => void): void {
        if (nextTest) { this.nextTest = nextTest; }
        var reporter: Reporter;
        describe("Reporter", () => {

            beforeEach(() => {
                reporter = new Reporter(TestConstants.PALANTIRLINTOUTPUT,
                    "TestSrc.ts", { bell: false, sort: false });
            });

            after(() => {
                this.tearDown();
            });

            describe("constructors", () => {
                it("should accept palantir/tslint input", () => {
                    var expected = TestConstants.PALANTIRLINTOUTPUT[0];
                    var actual = reporter.getRuleFailures()[0];
                    assert.equal(actual.getFailure(), expected.failure);
                    assert.equal(actual.getStartPosition().line, expected.startPosition.lineAndCharacter.line);
                });

                it("should accept non-palantir input", () => {
                    var expected = TestConstants.LINTOUTPUT[0];
                    var reporter = new Reporter(TestConstants.LINTOUTPUT, <Vinyl.File> TestConstants.LINTEDFILE);
                    var actual = reporter.getRuleFailures()[0];
                    assert.equal(actual.getFailure(), expected.failure);
                    assert.equal(actual.getStartPosition().line, expected.startPosition.line);
                });
            });

            describe("accessors", () => {
                it("should get the formated filename", () => {
                    assert.equal(reporter.getFileName(), "TestSrc.ts");
                });

                it("should get the failure count", () => {
                    assert.equal(reporter.getCount(), TestConstants.LINTOUTPUT.length);
                });

                it("should get a list of rule failures", () => {
                    assert.deepEqual(reporter.getRuleFailures(), TestConstants.LINTOUTPUT);
                });

                it("should get the options object", () => {
                    assert.deepEqual(reporter.getOptions(), { bell: false, sort: false });
                });
            });

            describe("toString", () => {
                it("should return the stylish string unsorted with no bell", () => {
                    var expected = TestConstants.FORMATTEDOUTPUT.title +
                        TestConstants.FORMATTEDOUTPUT.contentUnsorted +
                        TestConstants.FORMATTEDOUTPUT.count;
                    assert.equal(reporter.toString(), expected);
                });

                it("should return the stylish string sorted with no bell", () => {
                    var reporter = new Reporter(TestConstants.LINTOUTPUT, <Vinyl.File> TestConstants.LINTEDFILE, { bell: false});
                    var expected = TestConstants.FORMATTEDOUTPUT.title +
                        TestConstants.FORMATTEDOUTPUT.contentSorted +
                        TestConstants.FORMATTEDOUTPUT.count;
                    assert.equal(reporter.toString(), expected);
                });

                it("should return the stylish string sorted with bell", () => {
                    var reporter = new Reporter(TestConstants.LINTOUTPUT, <Vinyl.File> TestConstants.LINTEDFILE);
                    var expected = TestConstants.FORMATTEDOUTPUT.title +
                        TestConstants.FORMATTEDOUTPUT.contentSorted +
                        TestConstants.FORMATTEDOUTPUT.count +
                        TestConstants.FORMATTEDOUTPUT.bell;
                    assert.equal(reporter.toString(), expected);
                });
            });

            describe("publish", () => {
                it("should output the stylish string to stdout", () => {
                    var reporter = new Reporter(TestConstants.LINTOUTPUT, <Vinyl.File> TestConstants.LINTEDFILE);
                    var expected = TestConstants.FORMATTEDOUTPUT.title +
                        TestConstants.FORMATTEDOUTPUT.contentSorted +
                        TestConstants.FORMATTEDOUTPUT.count +
                        TestConstants.FORMATTEDOUTPUT.bell;
                    this.logInterceptor.clearLog();
                    reporter.publish();
                    assert.equal(this.logInterceptor.getLog(), expected);
                });
            });
        });
    }

    public tearDown = (): void => {
        this.logInterceptor.destroy();
        if (this.nextTest) { this.nextTest(); }
    };
}

export = ReporterSpec;
