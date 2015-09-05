/// <reference path="../typings/stylish.d.ts" />

var chalk = require("chalk");
var table = require("text-table");
var logSymbols = require("log-symbols");
var _ = require("lodash");
var path = require("path");

import RuleFailure = require("./ruleFailure");

type IPalantirRuleFailureObject = Stylish.IPalantirRuleFailureObject;
type IRuleFailureObject = Stylish.IRuleFailureObject;
type IOptions = Stylish.IOptions;

class Reporter {
    private fileName: string;
    private count: number;
    private ruleFailures: RuleFailure[];
    private options: IOptions;

    constructor(linterOutputArray: IRuleFailureObject[], file: Vinyl.File, options?: IOptions);
    constructor(linterOutputArray: IPalantirRuleFailureObject[], file: string, options?: IOptions);
    constructor(linterOutputArray: any, file: any, options?: any) {
        var fileStr = file.path || file;
        this.fileName = path.basename(fileStr);
        this.ruleFailures = RuleFailure.ruleFailureFactory(linterOutputArray);
        this.count = this.ruleFailures.length;
        this.options = options || {};
    }

    public getFileName(): string { return this.fileName; }

    public getCount(): number { return this.count; }

    public getRuleFailures(): RuleFailure[] { return this.ruleFailures; }

    public getOptions(): IOptions { return this.options; }

    public toString(): string {
        var count = "    " + chalk.red(logSymbols.error) + " " +
            this.count + " error" +
            (this.ruleFailures.length > 1 ? "s" : "");
        var output = "\n" + chalk.underline(this.fileName) + "\n" +
                this.generateFailureStrings() +
                "\n\n" + count + "\n\n";
        if (this.options.bell !== false) { output += "\x07"; }
        return output;
    }


    public publish(): void {
        process.stdout.write(this.toString());
    }

    private generateFailureStrings(): string {
        var failures = [];

        if (this.options.sort !== false) {
            this.ruleFailures = _.sortBy(this.ruleFailures, function (n) {
                return n.startPosition.line;
            });
        }

        this.ruleFailures.forEach((failure: RuleFailure) => {
            // Error positions are zero-based from tslint, and must be incremented by 1
            failures.push([
                "    ",
                chalk.gray("line " + (failure.getStartPosition().line + 1)),
                chalk.gray("col " + (failure.getStartPosition().character + 1)),
                chalk.red(failure.getFailure())
            ]);
        });

        return table(failures, { align: [ "l", "l", "l", "l" ] });
    }
}

export = Reporter
