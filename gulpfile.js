const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const connect = require("gulp-connect");
const imagemin = require("gulp-imagemin");

const paths = {
  html: {
    main: "/dist/index.html"
  },

  styles: {
    all: "src/sass/**/*.scss",
    main: "src/sass/main.scss",
  },

  scripts: {
    all: "src/scripts/**/*.js",
    main: "src/scripts/app.js",
  },

  images: {
    all: "src/images/*",
  },

  output: "dist",
};

function watcher() {
  watch(paths.html.main, { ignoreInitial: false }, html);
  watch(paths.styles.all, { ignoreInitial: false }, styles);
  watch(paths.scripts.all, { ignoreInitial: false }, scripts);
  watch(paths.images.all, { ignoreInitial: false }, images);
}

function server() {
  connect.server({
    root: "dist",
    livereload: true,
    port: 3000,
  });
}

function html() {
  return src(paths.html.main).pipe(dest(paths.output)).pipe(connect.reload());
}

function styles() {
  return src(paths.styles.main)
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(dest(paths.output))
    .pipe(connect.reload());
}

function scripts() {
  return browserify(paths.scripts.main)
    .transform(
      babelify.configure({
        presets: ["@babel/preset-env"],
      })
    )
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(dest(paths.output))
    .pipe(connect.reload());
}

function images() {
  return src(paths.images.all).pipe(imagemin()).pipe(dest("dist/images"));
}

exports.default = parallel(server, watcher);
