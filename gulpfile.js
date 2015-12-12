var gulp =          require('gulp');
var concat =        require('gulp-concat');
var uglify =        require('gulp-uglify');
var processhtml =   require('gulp-processhtml');
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

var environments = {
    dist : {
        data: {
            assets: config.folders.assets,
        },
    },
    dev : {
        data: {
            assets: config.folders.assets,
        },
    },
};

gulp.task('html', function() {
    gulp.src(['src/html/**/*.html', '!src/html/layout/**/*'])
        .pipe(processhtml({
            recursive: true,
            process: true,
            strip: true,
            environment: environments.dist,
            data: environments.dist.data,
        }))
        .pipe(gulp.dest(path.join(paths.html)));
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
