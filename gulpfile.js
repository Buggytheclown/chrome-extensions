const gulp = require("gulp");
const gulpCopy = require("gulp-copy");
const clean = require("gulp-clean");
const concat = require("gulp-concat");

const sourceFiles = [
  "src/popup/*.css",
  "src/popup/*.html",
  "src/contentScript/*.js"
];
const outputPath = "extension/dist";

function copyTask() {
  return gulp.src(sourceFiles).pipe(gulpCopy(outputPath, { prefix: 1 }));
}

function cleanTask() {
  return gulp.src(outputPath, { read: false }).pipe(clean());
}

function buildPopup() {
  return gulp
    .src(["src/libs/uren.js", "src/popup/popup.js"])
    .pipe(concat("popup.js"))
    .pipe(gulp.dest(`${outputPath}/popup`));
}

const seriesTasks = gulp.series(cleanTask, copyTask, buildPopup);
exports.default = seriesTasks;

// gulp.watch(sourceFiles, seriesTasks);
