/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/vinyl.d.ts"/>
var Stylish;
(function (Stylish) {
    var chalk = require("chalk");
    var table = require("text-table");
    var logSymbols = require("log-symbols");
    var _ = require("lodash");
    var path = require("path");
    var Reporter = (function () {
        function Reporter(linterOutputArray, file, options) {
            this.parseOptions(options);
            this.parseFilename(file);
            this.linterOutputArray = linterOutputArray;
            this.count = "    " + chalk.red(logSymbols.error) + " " +
                this.linterOutputArray.length + " error" +
                (this.linterOutputArray.length > 1 ? "s" : "");
        }
        Reporter.prototype.getFailures = function () {
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
            return table(failures, { align: ["l", "l", "l", "l"] });
        };
        Reporter.prototype.publish = function () {
            process.stdout.write("\n" + chalk.underline(this.fileName) + "\n");
            process.stdout.write(this.getFailures());
            process.stdout.write("\n\n" + this.count + "\n\n");
            if (this.options.bell) {
                process.stdout.write("\x07");
            }
        };
        Reporter.prototype.parseOptions = function (options) {
            this.options = options || {};
            if (this.options.sort !== false) {
                this.options.sort = true;
            }
            if (this.options.bell !== false) {
                this.options.bell = true;
            }
            if (this.options.fullPath !== false) {
                this.options.fullPath = true;
            }
        };
        Reporter.prototype.parseFilename = function (file) {
            this.fileName = file.path || file;
            if (!this.options.fullPath) {
                this.fileName = path.basename(this.fileName);
            }
        };
        return Reporter;
    })();
    function generator(linterOut, file, options) {
        var reporter = new Reporter(linterOut, file, options);
        reporter.publish();
    }
    Stylish.generator = generator;
})(Stylish || (Stylish = {}));
module.exports = Stylish.generator;
