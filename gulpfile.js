var gulp =      require('gulp');
var concat =    require('gulp-concat');
var uglify =    require('gulp-uglify');
var del =       require('del');

gulp.task('html', function() {
    gulp.src('src/html/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', function() {
    gulp.src('src/js/**/*.js')
        .pipe(concat('final.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('clean', function() {
    return del([
        'dist'
    ]);
});

gulp.task('default', ['html', 'js']);
