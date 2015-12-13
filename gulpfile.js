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
    },

    plugins : {
        js : [
            'bower_components/html5shiv/dist/html5shiv.min.js',
            'bower_components/respond/dest/respond.min.js'
        ],
        jsConcat : [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
        ],
        css : [
            'bower_components/bootstrap/dist/js/bootstrap.min.css',
            'bower_components/font-awesome/css/font-awesome.min.css',
        ],
        fonts : [
            'bower_components/bootstrap/dist/fonts/*',
            'bower_components/font-awesome/fonts/*'
        ],
        img : [
        ]
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

var targets = {
    dist : {
        environment: 'dist',
        data: {
            assets: config.folders.assets,
        },
    },
    dev : {
        environment: 'dev',
        data: {
            assets: config.folders.assets,
        },
    },
};

gulp.task('plugins', function() {
    gulp.src(config.plugins.jsConcat)
        .pipe(concat('plugins.js', {}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js));

    gulp.src(config.plugins.js)
        .pipe(gulp.dest(paths.js));

    gulp.src(config.plugins.css)
        .pipe(concat('plugins.css', {}))
        .pipe(gulp.dest(paths.css));

    gulp.src(config.plugins.fonts)
        .pipe(gulp.dest(paths.fonts));

    gulp.src(config.plugins.img)
        .pipe(gulp.dest(paths.img));
});

gulp.task('html', function() {
    gulp.src(['src/html/**/*.html', '!src/html/layout/**/*'])
        .pipe(processhtml({
            recursive: true,
            process: true,
            strip: true,
            environment: targets.dev.environment,
            data: targets.dev.data
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
        ['plugins', 'html', 'js']
    );
});
