const gulp = require("gulp"),

browserSync = require("browser-sync").create(),
sass = require("gulp-sass"),
cleanCSS = require("gulp-clean-css"),
concat = require('gulp-concat'),

//autoprefixer = require("gulp-autoprefixer"),
sourcemaps = require("gulp-sourcemaps"),

terser = require("gulp-terser"),
minify = require("gulp-minify"),
gulpCopy = require('gulp-copy'),

postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssnano = require('cssnano');


function style() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sourcemaps.init())

    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins

    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/css"))

    .pipe(browserSync.stream());
}

function js() {
  return gulp
    .src("src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(concat('main.js'))
    .pipe(minify())
    
    .pipe(gulp.dest("dist/js"));
}


function copyHtml() {
  return gulp
    .src("src/*.html")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
}

function copyImages() {
  return gulp.src("src/img/*.{gif,jpg,png,svg}")
  .pipe(gulp.dest("dist/img"));
}

function copyFonts() {
  return gulp
    .src("src/fonts/*.{txt,woff,woff2,ttf}")
    .pipe(gulp.dest("dist/fonts"));
}

/*function copyCss() {
  return gulp
    .src("src/css/*.css")
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}*/

/*function copyJs() {
  return gulp.src("src/js/main-min.js")
  .pipe(gulp.dest("dist/js"));
}*/

function watch() {
  browserSync.init({
    server: "./dist"
  });

  gulp.watch("src/scss/**/*.scss", style);
  gulp.watch("src/*.html").on("change", browserSync.reload);
  gulp.watch("src/*.html", copyHtml);
  gulp.watch("src/img/*.{gif,jpg,png,svg}", copyImages);
  gulp.watch("src/fonts/*.{txt,woff,woff2,ttf}", copyFonts);
  gulp.watch("src/js/**/*.js", js);
  gulp.watch("src/js/*.js").on("change", browserSync.reload);
}

exports.style = style;
exports.js = js;
exports.watch = watch;
exports.copyHtml = copyHtml;
exports.copyImages = copyImages;
exports.copyFonts = copyFonts;


// exports.default = build;

const build = gulp.parallel(
  style,
  js,
  watch,
  copyHtml,
  copyImages,
  copyFonts,
  
);

gulp.task(build);
gulp.task("default", build);
