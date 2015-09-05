tslint-stylish
===================

![Build Status](https://travis-ci.org/adamfitzpatrick/tslint-stylish.svg?branch=develop)

Typescript lint reporter for tslint and gulp-tslint along the lines of jshint-stylish.  Support
for grunt will be added soon.  Note that this package will eventually replace gulp-tslint-stylish.

Thank you to
[Sindre Sorhus](https://github.com/sindresorhus) for the reporter design, and to
[Panu Horsmalahti](https://github.com/panuhorsmalahti) for creating
[gulp-tslint](https://github.com/panuhorsmalahti/gulp-tslint).

Installation
------------
Note that this is designed to accept output from tslint and gulp-tslint, which must be installed separately.
To install this package:

```
npm install tslint-stylish
```

Usage
-----
Tslint

- Install Tslint & tslint-stylish:

```
npm install tslint
npm install tslint-stylish
```

- Apply as named formatter:

```
tslint <path/to/target/files> -s node_modules/tslint-stylish -t stylish
```


Gulp

```
var gulp = require('gulp');
var tslint = require('gulptslint');
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
