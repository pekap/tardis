// https://github.com/Granze/react-starterify/blob/master/gulpfile.js

var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    minify = require('gulp-minify'),
    bower = require('gulp-bower'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    p = {
        jsx: './static/src/js/app.js',
        bundle: 'app.js',
        dist: './static/dist',
        distJs: './static/dist/js',
        watchSCSS: './static/src/scss/**/*.scss',
        srcSCSSMainFile: './static/src/scss/[^_]*.scss',
        distCSS: './static/dist/css',
        srcFonts: './static/src/fonts/**/*',
        distFonts: './static/dist/fonts',
        srcImg: './static/src/img/**/*',
        distImg: './static/dist/img',
        srcData: './static/src/data/**/*',
        distData: './static/dist/data',
        bowerDir: './bower_components'
    };

gulp.task('clean', function (cb) {
    del([p.distJs, p.distCSS, p.distImg, p.distData, p.distFonts]).then(function(paths) {
        cb();
    });
});

gulp.task('fonts', function () {
    return gulp
        .src(p.srcFonts)
        .pipe(gulp.dest(p.distFonts));
});

gulp.task('images', function () {
    return gulp
        .src(p.srcImg)
        .pipe(gulp.dest(p.distImg));
});

gulp.task('data', function () {
    return gulp
        .src(p.srcData)
        .pipe(gulp.dest(p.distData));
});

gulp.task('styles', function() {
  return gulp
      .src(p.srcSCSSMainFile)
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: [p.bowerDir + '/bourbon/app/assets/stylesheets']
      }).on('error',sass.logError))
      .pipe(cleanCSS({debug:false}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(p.distCSS))
      .pipe(livereload());
});


gulp.task('watchify', function () {
    var bundler = watchify(browserify(p.jsx, watchify.args));

    function rebundle() {
        return bundler
            .bundle()
            .on('error', notify.onError())
            .pipe(source(p.bundle))
            .pipe(gulp.dest(p.distJs));
    }

    bundler.transform(babelify.configure({
        presets: ['es2015']//, 'react']
    })).on('update', rebundle);

    return rebundle();
});

gulp.task('browserify', function () {
    browserify(p.jsx)
        .transform(babelify.configure({
            presets: ['es2015'] //, 'react']
        }))
        .bundle()
        .pipe(source(p.bundle))
        //.pipe(minify())
        .pipe(gulp.dest(p.distJs));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(p.bowerDir));
});

gulp.task('reloadHTML', function () {
    livereload.reload();
});

gulp.task('watch', ['build'], function () {
    gulp.start(['watchify']);
    gulp.watch(p.watchSCSS, ['styles']);
    gulp.watch('./index.html', ['reloadHTML']);
    livereload.listen();
});

gulp.task('build', ['clean','bower'], function () {
    process.env.NODE_ENV = 'production';
    gulp.start(['fonts']);
    gulp.start(['data']);
    gulp.start(['images']);
    gulp.start(['styles']);
    gulp.start(['browserify']);
});
