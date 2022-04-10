const {src, dest, task, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const gulpPostcss = require('gulp-postcss');
const rename = require('gulp-rename');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const sortCSSmq = require('sort-css-media-queries'); 
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const del = require('del');


const PATH = {
  scssFile: './assets/scss/style.scss',
  scssFiles: './assets/scss/**/*.scss',
  scssFolder: './assets/scss',
  cssFolder: './assets/css',
  cssMinFiles: './assets/css/*.min.css',
  htmlFiles: './*.html',
  jsFiles: [
    './assets/js/**/*.js',
    '!./assets/js/**/*.min.js',
    // '!./assets/js/**/bundle.js',
  ],
  jsMinFiles: './assets/js/**/*.min.js',
  jsFolder: './assets/js',
  jsBundleName: 'bundle.js',
  buildFolder: 'dist'
};

const PLUGINS = [
  autoprefixer({overrideBrowserslist: ['last 5 versions', '> 1%'], cascade: true}),
  mqpacker({sort: sortCSSmq})
]

function scss() {  
  return src(PATH.scssFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpPostcss(PLUGINS))
    .pipe(csscomb())
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream());
};

function scssDev() {
  const devPlugins = [...PLUGINS]
  devPlugins.shift()

  return src(PATH.scssFile, {sourcemaps: true})
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpPostcss(devPlugins))
    .pipe(dest(PATH.cssFolder, {sourcemaps: '.'}))
    .pipe(browserSync.stream());
};

function scssMin() {
  const pluginsExtended = PLUGINS.concat([cssnano({preset: 'default'})])
  
  return src(PATH.scssFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(csscomb())
    .pipe(gulpPostcss(pluginsExtended))
    .pipe(rename({suffix: '.min'}))
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream());
};

function comb() {
  return src(PATH.scssFiles)
  .pipe(csscomb())
  .pipe(dest(PATH.scssFolder))
};

function syncInit() {
  browserSync.init({
      server: {
          baseDir: './'
      }
  })
};

async function sync() {
  browserSync.reload();
};

function watchFiles() {
  syncInit()
  watch(PATH.scssFiles, series(scss, scssMin))
  watch(PATH.jsFiles, sync)
  watch(PATH.htmlFiles, sync)
};

function concatJS() {
  return src(PATH.jsFiles)
  .pipe(concat(PATH.jsBundleName))
  .pipe(dest(PATH.jsFolder))
};

function uglifyJS() {
  return src(PATH.jsFiles)
  .pipe(terser({
    toplevel: true,
    output: {quote_style: 3}
  }))
  .pipe(rename({suffix: '.min'}))
  .pipe(dest(PATH.jsFolder))
};

function buildHTML() {
  return src(PATH.htmlFiles)
  .pipe(dest(PATH.buildFolder + '/templates'))
};

function buildCSS() {
  return src(PATH.cssMinFiles)
  .pipe(dest(PATH.buildFolder + '/css'))
};

function buildJS() {
  return src(PATH.jsMinFiles)
  .pipe(dest(PATH.buildFolder + '/js'))
};

async function clearFolder() {
 await del(PATH.buildFolder, {force: true})
 return true
};

task('scss', series(scss, scssMin));
task('min', scssMin);
task('watch', watchFiles);
task('dev', scssDev);
task('comb', comb);

task('concat', concatJS);
task('uglify', uglifyJS);
task('build', series(clearFolder, parallel(buildJS, buildCSS, buildHTML)));
