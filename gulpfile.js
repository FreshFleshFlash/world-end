var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var uglifycss = require('gulp-uglifycss');

gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function () {
    return gulp.src(['js/twitterAPI.js', 'js/variable.js', 'js/browser.js', 'js/size.js', 'js/time.js', 'js/spinner.js',
            'js/tweets.js', 'js/thumb.js', 'js/chimney.js', 'js/smoke.js', 'js/sound.js', 'js/title.js',
            'js/auto.js', 'js/app.js'])
        .pipe(concat('main.js'))
        //.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    gulp.src('css/style.css')
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('default', ['html', 'scripts', 'css']);


//<script src="js/twitterAPI.js"></script>
//    <script src="js/variable.js"></script>
//    <script src="js/browser.js"></script>
//    <script src="js/size.js"></script>
//    <script src="js/time.js"></script>
//    <script src="js/spinner.js"></script>
//    <script src="js/tweets.js"></script>
//    <script src="js/thumb.js"></script>
//    <script src="js/chimney.js"></script>
//    <script src="js/smoke.js"></script>
//    <script src="js/sound.js"></script>
//    <script src="js/title.js"></script>
//    <script src="js/auto.js"></script>
//    <script src="js/app.js"></script>