var gulp =          require('gulp');
var concat =        require('gulp-concat');
var uglify =        require('gulp-uglify');
var del =           require('del');
var path =          require('path');
var runSequence =   require('run-sequence');

var config = {
    folders :  {
        dist : 'dist',
        assets: 'assets'
    }
};

var paths = {
    dist : path.join(config.folders.dist),
    assets : path.join(config.folders.dist, config.folders.assets),
    html : path.join(config.folders.dist),
    js : path.join(config.folders.dist, config.folders.assets, 'js'),
    fonts : path.join(config.folders.dist, config.folders.assets, 'fonts'),
    css : path.join(config.folders.dist, config.folders.assets, 'css'),
    img : path.join(config.folders.dist, config.folders.assets, 'img'),
};

gulp.task('html', function() {
    gulp.src('src/html/**/*.html')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function() {
    gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js));
});

gulp.task('clean', function() {
    return del([
        paths.dist
    ]);
});

gulp.task('default', function() {
    runSequence(
        'clean',
        ['html', 'js']
    );
});
