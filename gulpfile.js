var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync').create();
var del = require('del');
var wiredep = require('wiredep').stream;

var $ = gulpLoadPlugins();
var reload = browserSync.reload;


gulp.task('styles', function() {
    return gulp.src('src/css/*.css')
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Android >= 4.0'],
            cascade:true
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(reload({stream: true}));
});

/*
cleanCSS = require('gulp-clean-css')

gulp.task('cssmin', function() {
    return gulp.src(paths.debug.css)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest(paths.release.css));
});
*/

//require("gulp-rev");          //js引用哈希码
//require("gulp-rev-replace");  //更新文件名的引用
//require("gulp-useref");       //通过注释合并文件

gulp.task('html', ['styles'], function(){
    var jsFilter = $.filter('**/*.js', {restore: true});
    var cssFilter = $.filter('**/*.css', {restore: true});
    var indexHtmlFilter = $.filter(['**/*', '!**/index.html'], {restore: true});

    return gulp.src('src/*.html')
        .pipe($.useref({searchPath: ['src']}))
        .pipe(jsFilter)
        .pipe($.uglify({mangle: true, compress: {drop_console: true}}))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.cssnano({safe: true, autoprefixer: false}))
        .pipe(cssFilter.restore)
        .pipe(indexHtmlFilter)
        .pipe($.htmlmin({
            collapseWhitespace: true,                       //压缩HTML
            minifyCSS: true,
            minifyJS: {compress: {drop_console: true}},
            processConditionalComments: true,
            removeComments: true,                           //清除HTML注释
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe(rev())
        .pipe(indexHtmlFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest('dist'))
});




gulp.task('images', function() {
  return gulp.src('src/imag/**/*')
    .pipe($.imagemin({verbose: true}))
    .pipe(gulp.dest('dist/img'));
});
//.pipe($.cache($.imagemin()))

//10.gulp-responsive  [生成响应式图片]         https://www.npmjs.com/package/gulp-responsive/

gulp.task('fonts', function() {
  // return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
  //   .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'src/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));


/************ 本项目 **********/
//start
gulp.task('dist', ['clean'], function() {
    return gulp.src(['**/*.css', '!css/main.css',
                     '**/*.js', '**/*.json',
                     '*.ico', '*.html', '!404.html'], {cwd: 'src'})
    .pipe(gulp.dest('dist'));
});

gulp.task('serve:dist:news', ['dist'], function() {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('serve:src', function() {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: 'src'
        }
    });
});
//end


// 静态服务器
gulp.task('serve', ['bower'], function() {
    //runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: 'src',
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch(['*.html', 'js/*.js', 'img/**/*', 'fonts/**/*'], {cwd: 'src'}).on('change', reload);
    gulp.watch('css/*.css', {cwd: 'src'}, ['styles']);
});


gulp.task('serve:dist', ['default'], function() {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: 'dist'
        }
    });
});

// inject bower components
gulp.task('bower', function () {
  gulp.src('src/*.html')
    .pipe(wiredep({
        exclude: ['bootstrap.js', 'normalize.css', 'modernizr.js'],
        ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('src'));
});


gulp.task('build', ['html', 'images', 'fonts', 'extras'], function() {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean', 'bower', 'build']);

