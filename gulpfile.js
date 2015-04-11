(function () {
  'use strict';

  var stylish = require('./');
  var gulp = require('gulp');
  var mocha = require('gulp-mocha');
  var tslint = require('gulp-tslint');
  var tsc = require('gulp-typescript');
  var watch = require('gulp-watch');

  function fakeTslint() {
    gulp.src('test/fixtures/TestSrc.ts')
      .pipe(tslint())
      .pipe(tslint.report(stylish, {
        emitError: false,
        bell: false
      }));
  }
  gulp.task('lint', fakeTslint);

  var typescriptOptions = {
    declarationFiles: false,
    noExternalResolve: false,
    module: 'commonjs'
  };
  function tsCompile() {
    gulp.src('src/*.ts')
      .pipe(tslint())
      .pipe(tslint.report('verbose', {
        emitError: false
      }))
      .pipe(tsc(typescriptOptions))
      .js.pipe(gulp.dest(''));
  }
  gulp.task('compile', tsCompile);

  function tests() {
    gulp.src('test/*.js')
      .pipe(mocha({reporter: 'spec'}));
  }
  gulp.task('test', tests);

  gulp.task('default', ['test']);

  gulp.task('watch:source', function () {
    watch([
      'src/*.ts',
      'test/*.js'
    ], { verbose: true, name: 'Source' }, tsCompile);
  });

}());