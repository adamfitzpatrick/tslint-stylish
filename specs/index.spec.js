/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />
var stylish = require("../");
var assert = require("assert");
var gulp = require("gulp");
var tslint = require("gulp-tslint");
var util = require("util");
var Logger = (function () {
    function Logger() {
        var _this = this;
        this._log = [];
        this._write = process.stdout.write.bind(process.stdout);
        this._clog = console.log;
        if (Logger._instance) {
            throw new Error("Error: Instantiation failed.  Singleton class already instantiated.");
        }
        Logger._instance = this;
        var write = function (str) {
            _this._log.push(str);
        };
        process.stdout.write = write;
        console.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _this._write(util.format.apply(null, args) + "\n");
        };
    }
    Logger.prototype.getLog = function () {
        return this._log;
    };
    Logger.prototype.clearLog = function () {
        this._log = [];
    };
    Logger.prototype.destroy = function () {
        process.stdout.write = this._write;
        console.log = this._clog;
        Logger._instance = null;
    };
    Logger._instance = null;
    return Logger;
})();
var Specs = (function () {
    function Specs() {
        var _this = this;
        this.formattedOutput = TestParams.FORMATTEDOUTPUT;
        this.tearDown = function () {
            _this.logger.destroy();
        };
        this.logger = new Logger();
    }
    Specs.prototype.run = function (callback) {
        var _this = this;
        beforeEach(function () {
            _this.logger.clearLog();
        });
        after(function () {
            callback();
        });
        describe("release/index.js", function () {
            beforeEach(function () {
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE);
            });
            it("provides output as expected for minimum args", function () {
                _this.assertAll(_this.logger.getLog(), true, true, true);
            });
            it("sorts formattedOutput by default and when requested, but not if sort = false", function () {
                _this.assertAll(_this.logger.getLog(), true, true, true);
                _this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { sort: true });
                _this.assertAll(_this.logger.getLog(), true, true, true);
                _this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { sort: false });
                _this.assertAll(_this.logger.getLog(), false, true, true);
            });
            it("emits the system bell by default and when requested, but not if bell = false", function () {
                _this.assertAll(_this.logger.getLog(), true, true, true);
                _this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { bell: true });
                _this.assertAll(_this.logger.getLog(), true, true, true);
                _this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { bell: false });
                _this.assertAll(_this.logger.getLog(), true, false, true);
            });
            it("shows the full path by default and when requested, but not if fullPath = false", function () {
                _this.assertAll(_this.logger.getLog(), true, true, true);
                _this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { fullPath: true });
                _this.assertAll(_this.logger.getLog(), true, true, true);
                _this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { fullPath: false });
                _this.assertAll(_this.logger.getLog(), true, true, false);
            });
        });
        describe("gulp linter", function () {
            function linter(cb) {
                gulp.src("specs/fixtures/TestSrc.ts")
                    .pipe(tslint())
                    .pipe(tslint.report(stylish, {
                    emitError: false
                }))
                    .on("end", cb);
            }
            it("should be used to format report output from gulp-tslint", function (done) {
                _this.logger.clearLog();
                linter(function () {
                    _this.assertAll(_this.logger.getLog(), true, true, true);
                    done();
                });
            });
        });
    };
    Specs.prototype.assertAll = function (log, sort, bell, fullPath) {
        var formattedOutput = TestParams.FORMATTEDOUTPUT;
        var filename = fullPath ? formattedOutput.fullPath : formattedOutput.filename;
        assert.equal(log[0], filename);
        assert.equal(log[1], sort ? formattedOutput.contentSorted : formattedOutput.contentUnsorted);
        assert.equal(log[2], formattedOutput.count);
        if (bell) {
            assert.equal(log[3], formattedOutput.bell);
        }
    };
    return Specs;
})();
var TestParams = (function () {
    function TestParams() {
    }
    TestParams.LINTEDFILE = {
        path: "/Users/adam.fitzpatrick/play/tslint-stylish/specs/fixtures/TestSrc.ts"
    };
    TestParams.LINTOUTPUT = [
        {
            "name": "NOFILE",
            "failure": "file should end with a newline",
            "startPosition": {
                "position": 442,
                "line": 18,
                "character": 27
            },
            "endPosition": {
                "position": 442,
                "line": 18,
                "character": 27
            },
            "ruleName": "eofline"
        }, {
            "name": "NOFILE",
            "failure": "\' should be \"",
            "startPosition": {
                "position": 391,
                "line": 16,
                "character": 23
            },
            "endPosition": {
                "position": 397,
                "line": 16,
                "character": 29
            },
            "ruleName": "quotemark"
        }
    ];
    TestParams.FORMATTEDOUTPUT = {
        fullPath: "\n\u001b[4m" + process.cwd() + "/specs/fixtures/TestSrc.ts" + "\u001b[24m\n",
        filename: "\n\u001b[4mTestSrc.ts\u001b[24m\n",
        contentSorted: "      \u001b[90mline 17\u001b[39m  \u001b[90mcol 24\u001b[39m" +
            "  \u001b[31m\' should be \"\u001b[39m\n      \u001b[90mline 19\u001b[39m  " +
            "\u001b[90mcol 28\u001b[39m  \u001b[31mfile should end with a " +
            "newline\u001b[39m",
        contentUnsorted: "      \u001b[90mline 19\u001b[39m  \u001b[90mcol 28\u001b[39m  " +
            "\u001b[31mfile should end with a newline\u001b[39m\n      \u001b[90mline " +
            "17\u001b[39m  \u001b[90mcol 24\u001b[39m  \u001b[31m\' should be \"\u001b[39m",
        count: "\n\n    \u001b[31m\u001b[31m✖\u001b[31m\u001b[39m 2 errors\n\n",
        bell: "\u0007"
    };
    return TestParams;
})();
var specs = new Specs();
specs.run(specs.tearDown);
