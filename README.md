gulp-tslint-stylish
===================
Typescript lint reporter for gulp-tslint along the lines of jshint-stylish.  A special thanks to
[Sindre Sorhus](https://github.com/sindresorhus) for the reporter design, and to
[Panu Horsmalahti](https://github.com/panuhorsmalahti) for creating
[gulp-tslint](https://github.com/panuhorsmalahti/gulp-tslint).

Installation
------------
Note that this is designed to accept output from gulp-tslint.  Currently this module is only
available by cloning the repository, or pointing `npm` directly here:

```
npm install https://github.com/pteropus/gulp-tslint-stylish/tarball/v0.1.0
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
