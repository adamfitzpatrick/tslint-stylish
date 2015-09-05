import ReporterSpec = require("./reporter.spec");
import RuleFailureSpec = require("./ruleFailure.spec");
import StylishFormatterSpec = require("./stylishFormatter.spec");

var stylishRun = (): void => {
    var stylishFormatterSpec = new StylishFormatterSpec();
    stylishFormatterSpec.run();
};

var reporterSpec = new ReporterSpec();
reporterSpec.run(stylishRun);

var ruleFailureSpec = new RuleFailureSpec();
ruleFailureSpec.run();
