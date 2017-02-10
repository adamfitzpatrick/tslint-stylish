const gulp = require("gulp");
const path = require("path");
// const spawnMocha = require("gulp-spawn-mocha");
// const plumber = require("gulp-plumber");
const webpack = require("webpack");
const tslint = require("gulp-tslint");

const indexConfig = require("./webpack.config");
const formatterConfig = require("./webpack.formatter.config");

const webpacker = (configFunction) => {
    return new Promise((resolve, reject) => {
        webpack(configFunction()).run((err, stats) => {
            if (err) { return reject(err); }
            resolve(stats);
        });
    })
};

(function () {
    gulp.task("webpack", () => {
        const webpackers = [];
        webpackers.push(webpacker(indexConfig));
        webpackers.push(webpacker(formatterConfig));
        return Promise.all(webpackers);
    });

    gulp.task("tslint", () =>
        gulp.src("./src/reporter/reporter.ts")
            .pipe(tslint({
                formatter: "stylish"
            }))
            .pipe(tslint.report())
    );
}());