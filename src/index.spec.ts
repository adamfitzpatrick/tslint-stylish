/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/mocha.d.ts" />

var stylish = require("../");
var assert = require("assert");
var gulp = require("gulp");
var tslint = require("gulp-tslint");
var util = require("util");

interface WriteParams {
    (buffer: Buffer, cb?: Function): boolean;
    (str: string, cb?: Function): boolean;
    (str: string, encoding?: string, cb?: Function): boolean;
}

class Logger {
    private static _instance: Logger = null;
    private _log: Array<string> = [];
    private _write = process.stdout.write.bind(process.stdout);
    private _clog = console.log;

    constructor() {

        if (Logger._instance) {
            throw new Error("Error: Instantiation failed.  Singleton class already instantiated.");
        }
        Logger._instance = this;

        var write: WriteParams = (str: any): any => {
            this._log.push(str);
        };
        process.stdout.write = write;

        console.log = (...args: string[]) => {
            this._write(util.format.apply(null, args) + "\n");
        };
    }

    public getLog(): Array<string> {
        return this._log;
    }

    public clearLog(): void {
        this._log = [];
    }

    public destroy(): void {
        process.stdout.write = this._write;
        console.log = this._clog;
        Logger._instance = null;
    }
}

class Specs {
    private logger: Logger;
    private formattedOutput: Object = TestParams.FORMATTEDOUTPUT;

    constructor() {
        this.logger = new Logger();
    }

    public run(callback): void {

        beforeEach(() => {
            this.logger.clearLog();
        });

        after(() => {
            callback();
        });

        describe("release/index.js", () => {

            beforeEach(() => {
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE);
            });

            it("provides output as expected for minimum args", () => {
                this.assertAll(this.logger.getLog(), true, true, true);
            });

            it("sorts formattedOutput by default and when requested, but not if sort = false", () => {
                this.assertAll(this.logger.getLog(), true, true, true);
                this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { sort: true });
                this.assertAll(this.logger.getLog(), true, true, true);
                this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { sort: false });
                this.assertAll(this.logger.getLog(), false, true, true);
            });

            it("emits the system bell by default and when requested, but not if bell = false", () => {
                this.assertAll(this.logger.getLog(), true, true, true);
                this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { bell: true });
                this.assertAll(this.logger.getLog(), true, true, true);
                this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { bell: false });
                this.assertAll(this.logger.getLog(), true, false, true);
            });

            it("shows the full path by default and when requested, but not if fullPath = false", () => {
                this.assertAll(this.logger.getLog(), true, true, true);
                this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { fullPath: true });
                this.assertAll(this.logger.getLog(), true, true, true);
                this.logger.clearLog();
                stylish(TestParams.LINTOUTPUT, TestParams.LINTEDFILE, { fullPath: false });
                this.assertAll(this.logger.getLog(), true, true, false);
            });
        });

        describe("gulp linter", () => {

            function linter(cb) {
              gulp.src("specs/fixtures/TestSrc.ts")
                .pipe(tslint())
                .pipe(tslint.report(stylish, {
                  emitError: false
                }))
                .on("end", cb);
            }

            it("should be used to format report output from gulp-tslint", (done) => {
                this.logger.clearLog();
                linter(() => {
                  this.assertAll(this.logger.getLog(), true, true, true);
                  done();
                });
            });
        });
    }

    public tearDown: Function = () => {
        this.logger.destroy();
    };

    public assertAll(log: Array<string>, sort: boolean, bell: boolean, fullPath: boolean) {
        var formattedOutput = TestParams.FORMATTEDOUTPUT;
        var filename = fullPath ? formattedOutput.fullPath : formattedOutput.filename;
        assert.equal(log[0], filename);
        assert.equal(log[1], sort ? formattedOutput.contentSorted : formattedOutput.contentUnsorted);
        assert.equal(log[2], formattedOutput.count);
        if (bell) {
            assert.equal(log[3], formattedOutput.bell);
        }
    }
}

class TestParams {
    static LINTEDFILE = {
        path: process.cwd() + "/specs/fixtures/TestSrc.ts"
    };
    static LINTOUTPUT = [
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
    static FORMATTEDOUTPUT = {
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
}

var specs = new Specs();
specs.run(specs.tearDown);

