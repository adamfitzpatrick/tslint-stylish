/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/vinyl.d.ts"/>

module Stylish {

    var chalk = require("chalk");
    var table = require("text-table");
    var logSymbols = require("log-symbols");
    var _ = require("lodash");
    var path = require("path");

    interface IErrorPosition {
        position: number;
        line: number;
        character: number;
    }

    interface ILinterOutput {
        name: string;
        failure: string;
        startPosition: IErrorPosition;
        endPosition: IErrorPosition;
        ruleName: string;
    }

    interface IOptions {
        sort?: boolean;
        bell?: boolean;
    }

    class Reporter {
        private fileName: string;
        private count: string;
        private linterOutputArray: Array<ILinterOutput>;
        private options: IOptions;

        constructor(linterOutputArray: Array<ILinterOutput>, file: Vinyl.File, options?: IOptions) {
            this.fileName = chalk.underline(path.basename(file.path));

            this.linterOutputArray = linterOutputArray;

            this.count = "    " + chalk.red(logSymbols.error) + " " +
                this.linterOutputArray.length + " error" +
                (this.linterOutputArray.length > 1 ? "s" : "");

            this.options = options || {};
        }

        getFailures(): string {
            var failures = [];

            if (this.options.sort !== false) {
                this.linterOutputArray = _.sortBy(this.linterOutputArray, function (n) {
                    return n.startPosition.line;
                });
            }

            this.linterOutputArray.forEach(function (error) {
                // Error positions are zero-based from tslint, and must be incremented by 1
                failures.push([
                    "    ",
                    chalk.gray("line " + (error.startPosition.line + 1)),
                    chalk.gray("col " + (error.startPosition.character + 1)),
                    chalk.red(error.failure)
                ]);
            });

            return table(failures, { align: [ "l", "l", "l", "l" ] });
        }

        publish(): void {
            process.stdout.write("\n" + this.fileName + "\n");
            process.stdout.write(this.getFailures());
            process.stdout.write("\n\n" + this.count + "\n\n");
            if (this.options.bell !== false) { process.stdout.write("\x07"); }
        }
    }

    export function generator(linterOut: Array<ILinterOutput>, file: Vinyl.File, options?: IOptions) {
        var reporter = new Reporter(linterOut, file, options);
        reporter.publish();
    }

}

module.exports = Stylish.generator;
