const gulp = require("gulp");
const gulpCopy = require("gulp-copy");
const clean = require("gulp-clean");
const concat = require("gulp-concat");

const sourceFilesToCopy = [
  "src/popup/*.css",
  "src/popup/*.html",
  "src/contentScript/*.js",
  "src/background/*.js",
];

const sourceFilesToBuild = ["src/libs/uren.js", "src/popup/popup.js"];
const outputPath = "extension/dist";

function copyTask() {
  return gulp.src(sourceFilesToCopy).pipe(gulpCopy(outputPath, { prefix: 1 }));
}

function cleanTask() {
  return gulp.src(outputPath, { read: false }).pipe(clean());
}

function buildPopup() {
  return gulp
    .src(sourceFilesToBuild)
    .pipe(concat("popup.js"))
    .pipe(gulp.dest(`${outputPath}/popup`));
}

const seriesTasks = gulp.series(cleanTask, copyTask, buildPopup);
exports.default = seriesTasks;

gulp.watch(sourceFilesToCopy, copyTask);
gulp.watch(sourceFilesToBuild, buildPopup);
