'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });
});

gulp.task('sass', () => {
  return gulp.src([
    './scss/lib/*.scss',
    './scss/app.scss'
  ]).pipe(sass({
      includePaths: [
        './bower_components/normalize-css',
        './bower_components/components-font-awesome/scss'
      ],
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/styles'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('fonts', () => {
  return gulp.src([
    './bower_components/components-font-awesome/fonts/*.*'
  ]).pipe(gulp.dest('./public/fonts'));
});

gulp.task('watch', [ 'browserSync', 'sass', 'fonts' ], () => {
  gulp.watch([
    './scss/lib/*.scss',
    './scss/app.scss',
    './public/index..html'
  ], [ 'sass' ]);
});

gulp.task('default', [ 'watch' ]);
