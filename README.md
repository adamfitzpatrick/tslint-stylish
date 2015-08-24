gulp-tslint-stylish
===================

![Build Status](https://travis-ci.org/pteropus/gulp-tslint-stylish.svg?branch=master)

Typescript lint reporter for gulp-tslint along the lines of jshint-stylish.  A special thanks to
[Sindre Sorhus](https://github.com/sindresorhus) for the reporter design, and to
[Panu Horsmalahti](https://github.com/panuhorsmalahti) for creating
[gulp-tslint](https://github.com/panuhorsmalahti/gulp-tslint).

Installation
------------
Note that this is designed to accept output from gulp-tslint, which must be installed separately.
To install this package:

```
npm install gulp-tslint-stylish
```

Usage
-----

```
var gulp = require('gulp');
var tslint = require('gulp-tslint');
var stylish = require('gulp-tslint-stylish');

gulp.task('lint', function () {
    gulp.src('SourceFiles.ts')
      .pipe(tslint())
      .pipe(tslint.report(stylish, {
        emitError: false,
        sort: true,
        bell: true
      }));
```

Options
-------
- `sort`
	- Default is `true`
	- When true, failures are sorted by line number.
- `bell`
    - Default is `true`
    - When true, emits the system bell with report.
