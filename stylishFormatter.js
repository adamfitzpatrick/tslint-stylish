/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/tslint.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Stylish;
(function (Stylish) {
    var _ = require("lodash");
    var Formatter = (function (_super) {
        __extends(Formatter, _super);
        function Formatter() {
            _super.apply(this, arguments);
        }
        Formatter.prototype.format = function (failures) {
            return JSON.stringify(failures);
        };
        return Formatter;
    })(Lint.Formatters.AbstractFormatter);
    Stylish.Formatter = Formatter;
})(Stylish || (Stylish = {}));
module.exports.Formatter = Stylish.Formatter;
