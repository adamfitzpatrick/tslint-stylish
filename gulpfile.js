(function () {
  'use strict';

  var stylish = require('./');
  var gulp = require('gulp');
  var mocha = require('gulp-mocha');
  var tslint = require('gulp-tslint');
  var tsc = require('gulp-typescript');
  var watch = require('gulp-watch');

  var typescriptOptions = {
    declarationFiles: false,
    noExternalResolve: false,
    module: 'commonjs'
  };
  function tsCompile(cb) {
    gulp.src('src/*.ts')
      .pipe(tslint())
      .pipe(tslint.report(stylish, {
        emitError: false
      }))
      .pipe(tsc(typescriptOptions))
      .js.pipe(gulp.dest(''))
      .on('end', cb);
  }
  gulp.task('compile', tsCompile);

  function tests() {
    gulp.src('test/*.js')
      .pipe(mocha({reporter: 'spec'}));
  }
  gulp.task('test', tests);

  gulp.task('default', ['compile'], tests);

  gulp.task('watch:source', function () {
    watch([
      'src/*.ts',
      'test/*.js'
    ], { verbose: true, name: 'Source' }, tsCompile(tests));
  });

}());