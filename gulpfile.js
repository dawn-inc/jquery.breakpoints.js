'use strict';

/**
 * 汎用的に使用するDependencies
 */
const gulp = require('gulp');
const gutil = require('gulp-util');
const minify = require('gulp-minify');
const plumber = require('gulp-plumber');
const prettier = require('gulp-prettier');

/**
 * タスクランナー用設定
 */
const baseDir = {
  src: 'src',
  dist: 'dist',
  js: 'js'
};

const filePattern = {
  javascript: [
    `${baseDir.src}/**/**/*.js`
  ]
};

/**
 * JavaScriptをコードフォーマットするタスク
 */
gulp.task('javascript', () => {
  return gulp.src(filePattern.javascript, { base: baseDir.src })
    .pipe(plumber())
    .pipe(prettier({
      printWidth: 80,
      tabWidth: 4,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: 'none',
      bracketSpacing: true
    }))
    .pipe(gulp.dest(baseDir.src))
    .pipe(minify({
      ext: {
          src:'.js',
          min:'.min.js'
      },
      preserveComments: 'some'
    }))
    .pipe(gulp.dest(baseDir.dist))
});

/**
 * watch タスク
 */
gulp.task('watch', ['javascript'], () => {
  gulp.watch(filePattern.javascript, ['javascript']);
});

/**
 * defaultタスク
 * 誤作動防止のため、タスクが指定されていない場合は、ヘルプメッセージを表示して終了する
 */
gulp.task('default', () => {
  gutil.log(`
    使用方法:
        gulp <タスク名>

    タスク名一覧:
        default - (またはタスク名を指定しない場合)このメッセージを表示します
        watch   - JavaScript ファイルを監視してタスクを実行します
  `);
});
