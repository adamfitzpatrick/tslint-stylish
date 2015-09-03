var IndexSpec = require("./index.spec");
var StylishFormatterSpec = require("./stylishFormatter.spec");
var GulpGruntSpec = require("./gulpGrunt.spec");

var gulpGruntRun = (): void => {
    var gulpGruntSpec = new GulpGruntSpec();
    gulpGruntSpec.run();
};

var stylishRun = (): void => {
    var stylishFormatterSpec = new StylishFormatterSpec();
    stylishFormatterSpec.run(gulpGruntRun);
};

var indexSpec = new IndexSpec();
indexSpec.run(stylishRun);
