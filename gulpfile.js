var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    md5 = require('gulp-md5'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    inject = require('gulp-inject'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('default', ['clean'], function() {
  // gulp.start('inject-header', 'images');
  gulp.start('inject-header');
});

gulp.task('sass', function() {
  return gulp.src(['./src/scss/*.scss', '!./src/scss/normalize.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(notify({ message: 'Sass task complete' }));
});

gulp.task('styles', ['sass'], function() {
  return gulp.src('src/css/**/*.css')
    .pipe(autoprefixer('last 7 version', 'safari >= 5', 'ie >= 8', 'opera 12.1', 'ios >= 7', 'android >= 4'))
    // .pipe(gulp.dest('public/css'))
    // .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(md5())
    .pipe(gulp.dest('public/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src(['src/js/jquery-3.2.1.js', 'src/js/**/*.js'])
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    // .pipe(concat('main.js'))
    // .pipe(gulp.dest('public/js'))
    // .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(md5())
    .pipe(gulp.dest('public/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({optimizationLevel: 5, progressive: true, interlaced: true})))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
  // return del(['public/css', 'public/js', 'public/images']);
  return del(['public/css/*', 'public/js/*']);
});

gulp.task('watch', function() {
  // Create LiveReload server
  // livereload.listen();

  // Watch any files in dist/, reload on change
  // gulp.watch(['src/**']).on('change', livereload.changed);
  // gulp.watch(['src/**']).on('change', function () {
  //   gulp.start('default');
  // });

  gulp.watch(['src/scss/**', 'src/js/**']).on('change', function () {
    gulp.start('default');
  });

  // gulp.watch(['src/scss/**']).on('change', function () {
  //   gulp.start('sass');
  // });
});

gulp.task('inject-header', ['styles', 'scripts'], function() {
  var sourcesBlog = gulp.src([
    './public/js/jquery*.js',
    './public/js/*.js',
    '!./public/js/admin*.js',
    '!./public/js/thin-editor*.js',
    './public/css/*.css',
    '!./public/css/admin*.css',
    ], {read: false});

  var sourcesAdmin = gulp.src([
    './public/js/jquery*.js',
    './public/js/*.js',
    './public/js/medium-editor/*.js',
    '!./public/js/thin-editor*.js',
    './public/css/*.css',
    './public/css/medium-editor/*.css',
    ], {read: false});

  var sourcesIndex = gulp.src([
    './public/js/common.js',
    '!./public/js/thin-editor*.js',
    './public/css/*.css',
    '!./public/css/admin*.css',
    ], {read: false});
  // var sourcesCss = gulp.src(['./src/**/common.js', './src/**/common.css'], {read: false});

  // inject admin header
  gulp.src('./views/admin/header.jade')
    .pipe(inject(sourcesAdmin, {ignorePath: 'public/'}))
    .pipe(gulp.dest('./views/admin'))
    .pipe(notify({ message: 'inject admin header complete' }));

  // inject index
  gulp.src('./views/index.jade')
    .pipe(inject(sourcesIndex, {ignorePath: 'public/'}))
    .pipe(gulp.dest('./views'))
    .pipe(notify({ message: 'inject index complete' }));

  // inject header without i18n
  gulp.src('./views/header-without-i18n.jade')
    .pipe(inject(sourcesBlog, {ignorePath: 'public/'}))
    .pipe(gulp.dest('./views'))
    .pipe(notify({ message: 'inject header without i18n complete' }))

  return gulp.src('./views/header.jade')
    .pipe(inject(sourcesBlog, {ignorePath: 'public/'}))
    .pipe(gulp.dest('./views'))
    .pipe(notify({ message: 'inject task complete' }));
});



