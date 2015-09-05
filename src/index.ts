/// <reference path="../typings/stylish.d.ts" />

import RuleFailure = require("./ruleFailure");
import Reporter = require("./reporter");

module.exports = function (linterOut: Stylish.IRuleFailureObject[], file: Vinyl.File, options?: Stylish.IOptions) {
    var reporter = new Reporter(linterOut, file, options);
    reporter.publish();
};
