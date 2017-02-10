import Reporter from "../reporter/reporter";
import { PalantirRuleFailureObject } from "../models/rule-failure-object.model";

export class Formatter {

    private files: { [name: string]: PalantirRuleFailureObject[] } = {};

    public format(failures: PalantirRuleFailureObject[]): string {
        this.invertLints(failures);
        let output = "";
        for (const filename in this.files) {
            const linterOutput = this.files[filename];
            var reporter = new Reporter(linterOutput, linterOutput[ 0 ].fileName, {bell: false});
            output += reporter.toString();
        };
        return output;
    }

    private invertLints(failures: PalantirRuleFailureObject[]): void {
        failures.forEach((failure: PalantirRuleFailureObject) => {
            if (!this.files[failure.fileName]) { this.files[failure.fileName] = []; }
            this.files[failure.fileName].push(failure);
        });
    }
}
