/// <reference path="../typings/stylish.d.ts" />
var Reporter = require("./reporter");
module.exports = function (linterOut, file, options) {
    var reporter = new Reporter(linterOut, file, options);
    reporter.publish();
};
