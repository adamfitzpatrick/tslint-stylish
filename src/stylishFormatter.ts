/// <reference path="../typings/stylish.d.ts"/>

var _ = require("lodash");

import Reporter = require("./reporter");

class Formatter {

    private files: { [name: string]: Stylish.IPalantirRuleFailureObject[] } = {};

    public format(failures: Stylish.IPalantirRuleFailureObject[]): string {
        this.invertLints(failures);
        var output = "";
        _.forEach(this.files, (linterOutput: Stylish.IPalantirRuleFailureObject[]) => {
            var reporter = new Reporter(linterOutput, linterOutput[0].fileName, { bell: false });
            output += reporter.toString();
        });
        return output;
    }

    private invertLints(failures: Stylish.IPalantirRuleFailureObject[]): void {
        failures.forEach((failure: Stylish.IPalantirRuleFailureObject) => {
            if (!this.files[failure.fileName]) { this.files[failure.fileName] = []; }
            this.files[failure.fileName].push(failure);
        });
    }
}

export = Formatter;
