var gulp =          require('gulp');
var concat =        require('gulp-concat');
var connect =       require('gulp-connect');
var gulpif =        require('gulp-if');
var jshint =        require('gulp-jshint');
var beautify =      require('gulp-beautify');
var please =        require('gulp-pleeease');
var rename =        require('gulp-rename');
var sass =          require('gulp-sass');
var uglify =        require('gulp-uglify');
var processhtml =   require('gulp-processhtml');
var del =           require('del');
var path =          require('path');
var runSequence =   require('run-sequence');
var imageop =       require('gulp-image-optimization');

var config = {
    folders :  {
        dist : 'dist',
        assets: 'assets'
    },

    plugins : {
        js : [
            'bower_components/html5shiv/dist/html5shiv.min.js',
            'bower_components/respond/dest/respond.min.js',
            'bower_components/holderjs/holder.min.js'
        ],
        jsConcat : [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/prism/prism.js',
            'bower_components/prism/plugins/line-numbers/prism-line-numbers.min.js',
            'bower_components/wow/dist/wow.min.js',
            'bower_components/lightbox2/dist/js/lightbox.min.js'
        ],
        css : [
            'bower_components/animate.css/animate.min.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/font-awesome/css/font-awesome.min.css',
            // 'bower_components/prism/themes/prism.css',
            'bower_components/prism/plugins/line-numbers/prism-line-numbers.css',
            'bower_components/prism-theme-one-dark/prism-onedark.css',
            'bower_components/lightbox2/dist/css/lightbox.min.css'
        ],
        fonts : [
            'bower_components/bootstrap/dist/fonts/*',
            'bower_components/font-awesome/fonts/*'
        ],
        img : [
        ]
    },

    distMode : false,
    environment : 'dev'
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
        .pipe(concat('plugins.min.js', {}))
        .pipe(uglify(), beautify())
        .pipe(gulp.dest(paths.js));

    gulp.src(config.plugins.js)
        .pipe(gulp.dest(paths.js));

    gulp.src(config.plugins.css)
        .pipe(concat('plugins.min.css', {}))
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
            environment: targets[config.environment].environment,
            data: targets[config.environment].data
        }))
        .pipe(gulp.dest(path.join(paths.html)))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js))
        .pipe(connect.reload());
});

gulp.task('scss', function () {
  gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(config.distMode, please({
        "autoprefixer": true,
        "filters": true,
        "rem": true,
        "opacity": true
    })))
    .pipe(gulpif(config.distMode, rename({
        suffix: '.min',
        extname: '.css'
    })))
    .pipe(gulp.dest(paths.css))
    .pipe(connect.reload());
});

gulp.task('img', function() {
    gulp.src('src/img/**/*')
        .pipe(gulpif(config.distMode, imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.img))
        .pipe(connect.reload());
});

gulp.task('fonts', function() {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(paths.fonts))
        .pipe(connect.reload());
});

gulp.task('clean', function() {
    return del([
        paths.dist
    ]);
});

gulp.task('watch', function () {
    gulp.watch(['src/html/**/*'], ['html']);
    gulp.watch(['src/js/**/*'], ['js']);
    gulp.watch(['src/scss/**/*'], ['scss']);
    gulp.watch(['src/img/**/*'], ['img']);
    gulp.watch(['src/fonts/**/*'], ['fonts']);
});

gulp.task('connect', function() {
    connect.server({
        root: config.folders.dist,
        port: 8080,
        livereload: true
    });
});

gulp.task('default', function() {
    runSequence(
        ['connect', 'watch']
    );
});

gulp.task('dev', function() {
    runSequence(
        'clean',
        ['plugins', 'html', 'js', 'scss', 'img', 'fonts']
    );
});

gulp.task('work', function() {
    runSequence(
        'dev',
        'default'
    );
});

gulp.task('dist', function() {
    config.distMode = true;
    config.environment = 'dist';

    runSequence(
        'clean',
        ['plugins', 'html', 'js', 'scss', 'img', 'fonts']
    );
});
