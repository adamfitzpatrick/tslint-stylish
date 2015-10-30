var gulp = require("gulp");
var tslint = require("gulp-tslint");
var stylish = require(".");

gulp.src("specs/fixtures/TestSrc.ts")
    .pipe(tslint())
    .pipe(tslint.report(stylish, {
        emitError: false
    }))
    .on("end", noSort);

function noSort() {
    gulp.src("specs/fixtures/TestSrc.ts")
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: false
        }))
        .on("end", shortName);
}

function shortName() {
    gulp.src("specs/fixtures/TestSrc.ts")
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            fullPath: false
        }));
}
