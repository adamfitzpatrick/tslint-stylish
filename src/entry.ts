import Reporter from "./reporter/reporter";
import { RuleFailureObject } from "./models/rule-failure-object.model";
import { Options } from "./models/options.model";

export default function publishReport(linterOut: RuleFailureObject[], file: File, options?: Options) {
    const reporter = new Reporter(linterOut, file, options);
    reporter.publish();
}
