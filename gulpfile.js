'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

gulp.task('sass', () => {
  return gulp.src([
    './scss/lib/*.scss',
    './scss/app.scss'
  ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./styles'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: ''
    }
  });
});

gulp.task('watch', [ 'browserSync', 'sass' ], () => {
  gulp.watch([
    './scss/lib/*.scss',
    './scss/app.scss',
    './public/index..html'
  ], [ 'sass' ]);
});
