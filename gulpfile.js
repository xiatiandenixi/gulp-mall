var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    watchPath = require('gulp-watch-path'),
    sourcemaps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin');

//clean
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// watch
gulp.task('watchjs', function () {
    gulp.watch('src/assets/js/**/*.js', function () {
        gulp.src('src/assets/js/**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest('dist/assets/js'))
    })
});
gulp.task('watchcss', function () {
    gulp.watch('src/assets/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/assets/', 'dist/assets');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
});
// gulp.task('watchimage', function () {
//     gulp.watch('src/assets/images/**/*', function (event) {
//         var paths = watchPath(event,'src/assets/','dist/');
//
//         gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
//         gutil.log('Dist ' + paths.distPath);
//
//         gulp.src(paths.srcPath)
//             .pipe(imagemin({
//                 progressive: true
//             }))
//             .pipe(gulp.dest(paths.distDir))
//     })
// });

//压缩js
gulp.task('js', function() {
    gulp.src('src/assets/js/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify().on('error', gutil.log))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/assets/js'));
    gulp.src('src/assets/js/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(minifycss().on('error', gutil.log))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/assets/js'))
});

//压缩css
gulp.task('css', function () {
    gulp.src('src/assets/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(minifycss().on('error', gutil.log))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/assets/css'))
});

//压缩图片
gulp.task('image', function () {
    gulp.src('src/assets/images/**/*')
        .pipe(imagemin({
            progressive: true
        }).on('error', gutil.log))
        .pipe(gulp.dest('dist/assets/images'));
});
// 压缩html
gulp.task('html', function() {
    gulp.src('src/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}).on('error', gutil.log))
        .pipe(gulp.dest('dist/'));
    gulp.src('src/**/*.ejs')
        .pipe(htmlmin({collapseWhitespace: true}).on('error', gutil.log))
        .pipe(gulp.dest('dist/'));
});
//复制icon
gulp.task('icon', function () {
    gulp.src('src/assets/js/font/fonts/*')
        .pipe(gulp.dest('dist/assets/js/font/fonts/'))
});
//复制字体
gulp.task('font', function () {
    gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts/'))
});

gulp.task('dist', ['html', 'css', 'js', 'image', 'icon', 'font']);
gulp.task('watch', ['watchcss', 'watchjs']);