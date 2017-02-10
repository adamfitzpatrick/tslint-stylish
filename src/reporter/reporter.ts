const chalk = require("chalk");
const table = require("text-table");
const logSymbols = require("log-symbols");
const path = require("path");

import { PalantirRuleFailureObject, RuleFailureObject } from "../models/rule-failure-object.model";
import { Options } from "../models/options.model";
import RuleFailure from "../rule-failure/rule-failure";

export default class Reporter {
    private fileName: string
    private count: number;
    private ruleFailures: RuleFailure[];
    private options: Options

    constructor(linterOutputArray: RuleFailureObject[],file: File,options?: Options);
    constructor(linterOutputArray: PalantirRuleFailureObject[], file: string, options?: Options);
    constructor(linterOutputArray: any, file: any, options?: any) {
        this.parseOptions(options);
        this.parseFilename(file);
        this.ruleFailures = RuleFailure.ruleFailureFactory(linterOutputArray);
        this.count = this.ruleFailures.length;
    }

    getFileName(): string { return this.fileName; }

    getCount(): number { return this.count; }

    getRuleFailures(): RuleFailure[] { return this.ruleFailures; }

    getOptions(): Options { return this.options; }

    toString(): string {
        let pluralizer = this.ruleFailures.length > 1 ? "s" : "";
        let count = `    ${chalk.red(logSymbols.error)} ${this.count} error${pluralizer}`;
        let output = `\n${chalk.underline(this.fileName)}\n${this.generateFailureStrings()}\n\n${count}\n\n`;
        if (this.options.bell) { output += "\x07"; }
        return output;
    }

    publish(): void {
        process.stdout.write(this.toString());
    }

    generateFailureStrings(): string {
        let failures = [];

        if (this.options.sort) {
            this.ruleFailures = this.ruleFailures.sort(this.sortFailures);
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

    parseOptions(options): void {
        this.options = options || {};
        if (this.options.sort !== false) { this.options.sort = true; }
        if (this.options.bell !== false) { this.options.bell = true; }
        if (this.options.fullPath !== false) { this.options.fullPath = true; }
    }

    parseFilename(file): void {
        this.fileName = file.path || file;
        if (!this.options.fullPath) { this.fileName = path.basename(this.fileName); }
    }

    private sortFailures(a: RuleFailure, b: RuleFailure) {
        return a.getStartPosition().line - b.getStartPosition().line;
    }
}
