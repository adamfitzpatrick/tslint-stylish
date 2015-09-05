/// <reference path="../typings/stylish.d.ts" />
var chalk = require("chalk");
var table = require("text-table");
var logSymbols = require("log-symbols");
var _ = require("lodash");
var path = require("path");
var RuleFailure = require("./ruleFailure");
var Reporter = (function () {
    function Reporter(linterOutputArray, file, options) {
        var fileStr = file.path || file;
        this.fileName = path.basename(fileStr);
        this.ruleFailures = RuleFailure.ruleFailureFactory(linterOutputArray);
        this.count = this.ruleFailures.length;
        this.options = options || {};
    }
    Reporter.prototype.getFileName = function () { return this.fileName; };
    Reporter.prototype.getCount = function () { return this.count; };
    Reporter.prototype.getRuleFailures = function () { return this.ruleFailures; };
    Reporter.prototype.getOptions = function () { return this.options; };
    Reporter.prototype.toString = function () {
        var count = "    " + chalk.red(logSymbols.error) + " " +
            this.count + " error" +
            (this.ruleFailures.length > 1 ? "s" : "");
        var output = "\n" + chalk.underline(this.fileName) + "\n" +
            this.generateFailureStrings() +
            "\n\n" + count + "\n\n";
        if (this.options.bell !== false) {
            output += "\x07";
        }
        return output;
    };
    Reporter.prototype.publish = function () {
        process.stdout.write(this.toString());
    };
    Reporter.prototype.generateFailureStrings = function () {
        var failures = [];
        if (this.options.sort !== false) {
            this.ruleFailures = _.sortBy(this.ruleFailures, function (n) {
                return n.startPosition.line;
            });
        }
        this.ruleFailures.forEach(function (failure) {
            // Error positions are zero-based from tslint, and must be incremented by 1
            failures.push([
                "    ",
                chalk.gray("line " + (failure.getStartPosition().line + 1)),
                chalk.gray("col " + (failure.getStartPosition().character + 1)),
                chalk.red(failure.getFailure())
            ]);
        });
        return table(failures, { align: ["l", "l", "l", "l"] });
    };
    return Reporter;
})();
module.exports = Reporter;
