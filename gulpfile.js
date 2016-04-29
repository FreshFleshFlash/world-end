var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('scripts', function () {
    return gulp.src(['js/twitterAPI.js', 'js/variable.js', 'js/browser.js', 'js/size.js', 'js/time.js', 'js/spinner.js',
        'js/tweets.js', 'js/thumb.js', 'js/chimney.js', 'js/smoke.js', 'js/sound.js', 'js/title.js', 'js/tip.js',
        'js/auto.js', 'js/app.js'])
        .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('default', ['scripts']);


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
//    <script src="js/tip.js"></script>
//    <script src="js/auto.js"></script>
//    <script src="js/app.js"></script>