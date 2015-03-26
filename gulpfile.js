/*eslint-disable no-sync*/ // keeps a gulpfile simple

'use strict';

// 3rd-party modules

var browserify = require('browserify');
var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var mocha = require('gulp-mocha');
var transform = require('vinyl-transform');

// this module

gulp.task('build:lib', [], function () {
  var browserified = transform(function (filename) {
    var b = browserify({ entries: filename, standalone: 'chai' });
    return b.bundle();
  });
  return gulp.src('./assertive-chai.js')
    .pipe(browserified)
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build:tests', [], function () {
  var browserified = transform(function (filename) {
    var b = browserify({ entries: filename });
    return b.bundle();
  });
  return gulp.src('./tests/index.js')
    .pipe(browserified)
    .pipe(gulp.dest('./dist/tests'));
});

gulp.task('test:phantomjs', ['build:lib', 'build:tests'], function () {
  return gulp.src('tests/*.html')
    .pipe(mochaPhantomJS({}));
});

gulp.task('test:nodejs', [], function () {
  return gulp.src('tests/index.js', {read: false})
        .pipe(mocha());
});

gulp.task('default', ['build:lib', 'test:nodejs', 'test:phantomjs'], function () {});
