/*eslint-disable no-sync*/ // keeps a gulpfile simple

'use strict';

// 3rd-party modules

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var mocha = require('gulp-mocha');
var source = require('vinyl-source-stream');

// this module

gulp.task('build:lib', [], function () {
  var filename = './assertive-chai.js';
  var b = browserify({ entries: filename, standalone: 'chai' });
  return b.bundle()
    .pipe(source(filename))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/'))
    .on('error', gutil.log);
});

gulp.task('build:tests', [], function () {
  var filename = './tests/index.js';
  var b = browserify({ entries: filename, debug: true });
  return b.bundle()
    .pipe(source(filename))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/'))
    .on('error', gutil.log);
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
