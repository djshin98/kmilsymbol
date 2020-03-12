'use strict';

const { parallel, series, src, dest, watch } = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var markdown = require("gulp-markdown");
var inject = require("gulp-inject-string");

var uglify = require('gulp-uglify');
var babelify = require("babelify");
var browserify = require("browserify");
var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");

var del = require('del');

var paths = {
    md: {
        src: './*.md',
        dest: './docs/'
    },
    md_src: {
        src: './src/**/*.md',
        dest: './docs/'
    },
    scss: {
        src: './src/sass/**/*.scss',
        dest: './src/css/'
    },
    css: {
        src: './src/css/**/*.css',
        dest: './docs/'
    },
    scripts: {
        entries: ['./index.js'],
        output: 'milsymbol.js',
        output_src: 'milsymbol.development.js',
        dest: 'dist/'
    },
    js: {
        src: 'src/**/*.js',
        dest: 'dist/'
    },
    html: {
        src: 'src/**/*.html',
        dest: 'dist/'
    },
    libs: {
        src: 'src/libs/**/*.*',
        dest: 'dist/libs/'
    }
};

function clean() {
    return del(['dist']);
}

function md() {
    return src(paths.md.src)
        .pipe(markdown())
        .pipe(inject.prepend("<html><head></head><body>"))
        .pipe(inject.append("</body></html>"))
        .pipe(dest(paths.md.dest));
}

function md_src() {
    return src(paths.md_src.src)
        .pipe(markdown())
        .pipe(inject.prepend("<html><head></head><body>"))
        .pipe(inject.append("</body></html>"))
        .pipe(dest(paths.md_src.src));
}

function js_b() {
    return browserify({
            entries: paths.scripts.entries
        }).transform(babelify({
            presets: ["es2015"]
        }))
        .bundle()
        .pipe(source(paths.scripts.output))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(dest(paths.scripts.dest));
}

/*
function js_src_w() {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err)
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')))
            }
            resolve()
        })
    });
}

function js_src_b() {
    return browserify({
            entries: paths.scripts.entries
        }).transform(babelify)
        .bundle()
        .pipe(source(paths.scripts.output_src))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(dest(paths.scripts.dest));

}
*/

function scss() {
    return src(paths.scss.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest(paths.scss.dest));
}

function css() {
    return src(paths.css.src)
        .pipe(concat('style.css')) //병합하고
        .pipe(dest(paths.css.dest));
}

function html() {
    return src(paths.html.src)
        .pipe(dest(paths.html.dest));
}

function libs() {
    return src(paths.libs.src)
        .pipe(dest(paths.libs.dest));
}

function watchFiles() {

    watch(paths.md.src, md);
    watch(paths.md_src.src, md_src);

    watch(paths.scss.src, scss);
    watch(paths.css.src, css);
    watch(paths.html.src, html);
    watch(paths.libs.src, libs);
    // watch(paths.js.src, js_b);
}

exports.clean = series(clean);
exports.scss = parallel(scss);
exports.default = parallel(watchFiles, series(md, md_src, libs, scss, css, html));