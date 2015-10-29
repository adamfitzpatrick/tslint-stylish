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
        this.parseOptions(options);
        this.parseFilename(file);
        this.ruleFailures = RuleFailure.ruleFailureFactory(linterOutputArray);
        this.count = this.ruleFailures.length;
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
        if (this.options.bell) { output += "\x07"; }
        return output;
    }


    public publish(): void {
        process.stdout.write(this.toString());
    }

    private generateFailureStrings(): string {
        var failures = [];

        if (this.options.sort) {
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

export = Reporter
