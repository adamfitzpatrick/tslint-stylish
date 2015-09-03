/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/tslint.d.ts"/>

module Stylish {
    var _ = require("lodash");

    export class Formatter extends Lint.Formatters.AbstractFormatter {
        public format(failures: Lint.RuleFailure[]): string {
            return JSON.stringify(failures);
        }
    }
}
module.exports.Formatter = Stylish.Formatter;
