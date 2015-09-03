/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />

import support = require("./support");
var TestConstants = support.TestConstants;
var stylish = require(process.cwd());
var stylishFormatter = require(process.cwd() + "/release/stylishFormatter.js");
var assert = require("assert");
var fs = require("fs");
var gulp = require("gulp");
var tslint = require("gulp-tslint");

class GulpGruntSpecs {
    private logInterceptor: support.LogInterceptor;
    private nextTest: () => void;

    constructor() {
        this.logInterceptor = new support.LogInterceptor();
    }

    public run(nextTest?: () => void) {
        if (nextTest) { this.nextTest = nextTest; }

        describe("gulp linter", () => {

            function linter(cb) {
                gulp.src("specs/fixtures/TestSrc.ts")
                    .pipe(tslint())
                    .pipe(tslint.report(stylish, {
                    emitError: false
                }))
                    .on("end", cb);
            }

            beforeEach(() => {
                this.logInterceptor.clearLog();
                stylish(TestConstants.LINTOUTPUT, TestConstants.LINTEDFILE);
            });

            after(() => {
               this.tearDown();
            });

            it("should be used to format report output from gulp-tslint", (done) => {
                this.logInterceptor.clearLog();
                linter(() => {
                    this.assertAll(this.logInterceptor.getLog(), true, true);
                    done();
                });
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

module.exports = GulpGruntSpecs;
