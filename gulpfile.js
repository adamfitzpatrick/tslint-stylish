(function () {
    "use strict";

    var del = require("del");
    var gulp = require("gulp");
    var filter = require("gulp-filter");
    var mocha = require("gulp-mocha");
    var tslint = require("gulp-tslint");
    var tsc = require("gulp-typescript");
    var watch = require("gulp-watch");
    var batch = require("gulp-batch");
    var debug = require("gulp-debug");
    var minimist = require("minimist");
    require("gulp-help")(gulp, {
        description: "Help listing"
    });

    var options = minimist(process.argv.slice(2));
    function isProd() {
        return options._[0] === "prod";
    }

    var typescriptOptions = {
        declarationFiles: false,
        noExternalResolve: false,
        module: "commonjs"
    };

    function clean(cb) {
        del([
            "compiled",
            "index.js",
            "stylishFormatter.js",
            "reporter.js",
            "ruleFailure.js"
        ]);
        cb();
    }

    gulp.task("clean", clean);

    function tsCompile() {
        return gulp.src("src/**/*.ts")
            .pipe(tslint())
            .pipe(tslint.report("verbose", {
                emitError: isProd()
            }))
            .pipe(tsc(typescriptOptions))
            .js.pipe(gulp.dest("compiled/src"));
    }

    function specCompile() {
        return gulp.src(["specs/**/*.ts", "!specs/fixtures/**/*"])
            .pipe(tslint())
            .pipe(tslint.report("verbose", {
                emitError: isProd()
            }))
            .pipe(tsc(typescriptOptions))
            .js.pipe(gulp.dest("compiled/specs"));
    }

    gulp.task("compile:src", "Compile source typescript to javascript.", ["clean"], tsCompile);
    gulp.task("compile:spec", "Compile typescript specs to javascript.", ["clean"], specCompile);

    function unitTests() {
        return gulp.src("compiled/specs/*.spec.js")
            .pipe(mocha({reporter: "spec"}));
    }

    gulp.task("default", "Compile source and specs to javascript and run tests.", ["compile:src", "compile:spec"], unitTests);

    function prod() {
        return gulp.src([
            "compiled/src/*.js"
        ])
            .pipe(gulp.dest("./"));
    }
    gulp.task("prod", "Build for production: fails on error.", ["default"], prod);

    gulp.task("watch", function () {
        gulp.watch(["src/**/*.ts", "specs/**/*.ts"], ["default"]);
    });

}());