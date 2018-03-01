import autoprefixer from 'gulp-autoprefixer';
import base64 from 'gulp-base64';
import csso from 'gulp-csso';
import del from 'del';
import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import notifier from 'node-notifier';
import rev from 'gulp-rev';
import runSequence from 'run-sequence';
import stylus from 'gulp-stylus';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.js';


// The build directories for asset files.
const buildDirectory = __dirname + '/resources/assets/build';


/* ============================================================
 * CSS Tasks
 * ========================================================== */

const cssSrcDirectory = __dirname + '/resources/assets/src/css';


/**
 * @param src
 * @param {Function} [then]
 */
function buildCss(src, then) {

    return src.pipe(plumber({
        errorHandler: err => {
            gutil.beep();
            gutil.log(gutil.colors.red(err));
        }
    }))
        .pipe(stylus({'include css': true}))
        .pipe(autoprefixer('last 2 version', '> 1%'))
        .pipe(base64({
            baseDir: './',
            extensions: ['gif', 'jpeg', 'jpg', 'png', 'svg']
        }))
        .pipe(csso())
        .pipe(stylus({'include css': true}))
        .pipe(rev())
        .pipe(gulp.dest(buildDirectory))
        .pipe(rev.manifest(buildDirectory + '/rev-manifest.json', {
            base: buildDirectory,
            merge: true
        }))
        .pipe(gulp.dest(buildDirectory))
        .on('end', () => {
            notifier.notify({title: 'Build task', message: 'finished css build'});
            if (typeof then === 'function') {
                then();
            }
        });
}


// Build the "app.css" file.
gulp.task('delete-css-app', () => del(buildDirectory + '/app-*.css'));
gulp.task('build-css-app', ['delete-css-app'], () => {
    return buildCss(gulp.src(
        cssSrcDirectory + '/app.styl',
        {base: cssSrcDirectory}
    ));
});


/* ============================================================
 * Javascript Tasks
 * ========================================================== */

const jsSrcDirectory = __dirname + '/resources/assets/src/js';


/**
 * @param src
 * @param {string} name
 * @param {Function} [then]
 */
function buildJs(src, name, then) {

    return src.pipe(webpackStream(webpackConfig, webpack))
        .pipe(rev())
        .pipe(gulp.dest(buildDirectory))
        .pipe(rev.manifest(buildDirectory + '/rev-manifest.json', {
            base: buildDirectory,
            merge: true
        }))
        .pipe(gulp.dest(buildDirectory))
        .on('end', () => {
            notifier.notify({title: 'Build task', message: 'finished "' + name + '"js build'});
            if (typeof then === 'function') {
                then();
            }
        });
}


// Build the "app.js" file.
gulp.task('delete-js-app', () => {
    return del([buildDirectory + '/app-*.js', buildDirectory + '/app-*.map']);
});
gulp.task('build-js-app', ['delete-js-app'], () => {
    webpackConfig.entry = jsSrcDirectory + '/app.js';
    webpackConfig.output.path = __dirname + '/build';
    webpackConfig.output.filename = 'app.js';
    return buildJs(gulp.src([webpackConfig.entry]), 'app');
});


/* ============================================================
 * Watch Tasks
 * ========================================================== */

gulp.task('watch', () => {
    gulp.watch([cssSrcDirectory + '/**/*.styl'], {interval: 500}, ['build-css-app']);
    gulp.watch(
        [jsSrcDirectory + '/**/*.js'],
        {interval: 500},
        ['build-js-app']
    );
});


/* ============================================================
 * Full Build Tasks
 * ========================================================== */

gulp.task('delete-rev-manifest', () => del(buildDirectory + '/rev-manifest.json'));
gulp.task('build', () => {
    runSequence(
        'delete-rev-manifest',
        'build-css-app',
        'build-js-app'
    );
});