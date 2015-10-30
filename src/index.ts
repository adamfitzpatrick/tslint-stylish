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
        fullPath?: boolean;
    }

    class Reporter {
        private fileName: string;
        private count: string;
        private linterOutputArray: Array<ILinterOutput>;
        private options: IOptions;

        constructor(linterOutputArray: Array<ILinterOutput>, file: Vinyl.File, options?: IOptions) {
            this.parseOptions(options);
            this.parseFilename(file);

            this.linterOutputArray = linterOutputArray;

            this.count = "    " + chalk.red(logSymbols.error) + " " +
                this.linterOutputArray.length + " error" +
                (this.linterOutputArray.length > 1 ? "s" : "");
        }

        getFailures(): string {
            var failures = [];

            if (this.options.sort) {
                this.linterOutputArray = _.sortBy(this.linterOutputArray, function (n) {
                    return n.startPosition.line;
                });
            }

            this.linterOutputArray.forEach(function (error) {
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
            process.stdout.write("\n" + chalk.underline(this.fileName) + "\n");
            process.stdout.write(this.getFailures());
            process.stdout.write("\n\n" + this.count + "\n\n");
            if (this.options.bell) { process.stdout.write("\x07"); }
        }

        private parseOptions(options): void {
            this.options = options || {};
            if (this.options.sort !== false) { this.options.sort = true; }
            if (this.options.bell !== false) { this.options.bell = true; }
            if (this.options.fullPath !== false) { this.options.fullPath = true; }
        }

        private parseFilename(file): void {
            this.fileName = file.path || file;
            if (!this.options.fullPath) { this.fileName = path.basename(this.fileName); }
        }
    }

    export function generator(linterOut: Array<ILinterOutput>, file: Vinyl.File, options?: IOptions) {
        var reporter = new Reporter(linterOut, file, options);
        reporter.publish();
    }

}

module.exports = Stylish.generator;
