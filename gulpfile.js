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