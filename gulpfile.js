(function () {
  "use strict";

  var gulp = require("gulp");
  var mocha = require("gulp-mocha");
  var tslint = require("gulp-tslint");
  var tsc = require("gulp-typescript");
  var watch = require("gulp-watch");
  var batch = require("gulp-batch");
  var notify = require("gulp-notify");
  require("gulp-help")(gulp, {
    description: "Help listing"
  })

  var typescriptOptions = {
    declarationFiles: false,
    noExternalResolve: false,
    module: "commonjs"
  };
  function tsCompile() {
    return gulp.src([
        "src/*.ts",
        "!src/*.spec.ts"
      ])
      .pipe(tslint())
      .pipe(tslint.report("verbose", {
        emitError: false
      }))
      .pipe(tsc(typescriptOptions))
      .js.pipe(gulp.dest("release/"));
  }
  gulp.task("compile:src", "Compile source typescript to javascript.", tsCompile);

  function specCompile() {
    return gulp.src("src/*.spec.ts")
      .pipe(tslint())
      .pipe(tslint.report("verbose", {
        emitError: false
      }))
      .pipe(tsc(typescriptOptions))
      .js.pipe(gulp.dest("specs/"));
  }
  gulp.task("compile:specs", "Compile specs typescript to javascript.", specCompile);

  function tests() {
    return gulp.src("specs/*.js")
      .pipe(mocha({reporter: "spec"}))
      .pipe(notify({
        "title": "gulp-tslint-stylish",
        "subtitle": "Tests complete.",
        "message": " ",
        "sound": "Hero"
      }));
  }
  gulp.task("test", "Compile specs to javascript and run tests.", ["compile:specs"], tests);

  gulp.task("default", "Compile source and specs to javascript and run tests.", ["compile:src", "compile:specs"], tests);

  gulp.task("watch", "Re-compile all source and spec files and run all tests on typescript source change.", function () {
    watch([
      "src/*.ts",
    ], { verbose: true, name: "Source" }, function () {
      tsCompile();
      specCompile();
    });
    
    watch("**/*.js", { verbose: true, name: "Test" }, batch({ timeout: 200 },tests));
  });

}());