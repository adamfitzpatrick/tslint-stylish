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
            this.fileName = chalk.underline(path.basename(file.path));
            this.linterOutputArray = linterOutputArray;
            this.count = "    " + chalk.red(logSymbols.error) + " " + this.linterOutputArray.length + " error" + (this.linterOutputArray.length > 1 ? "s" : "");
            this.options = options || {};
            this.options.sort = options.sort || (typeof options.sort === "undefined");
            this.options.bell = options.bell || (typeof options.bell === "undefined");
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
                    chalk.gray("line " + error.startPosition.line),
                    chalk.gray("col " + error.startPosition.character),
                    chalk.red(error.failure)
                ]);
            });
            return table(failures, { align: ["l", "l", "l", "l"] });
        };
        Reporter.prototype.publish = function () {
            process.stdout.write("\n" + this.fileName + "\n");
            process.stdout.write(this.getFailures());
            process.stdout.write("\n\n" + this.count + "\n\n");
            if (this.options.bell) {
                process.stdout.write("\x07");
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
