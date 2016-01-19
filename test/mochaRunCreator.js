/* eslint-disable no-undef */

import gulp from 'gulp';
import gutil from 'gulp-util';
import mocha from 'gulp-mocha';
import path from 'path';

function reportError(errorReporter) {
  return errorReporter === 'process' ? process.exit.bind(process, 1) : log;
}

const STACK_ERRORS = [
  'SyntaxError',
  'TypeError',
];

function log(msg) {
  gutil.log(STACK_ERRORS.includes(msg.name) ? msg.stack : msg);
}

export default function mochaRunCreator(errorReporter = 'process') {
  return (file) => {
    let source = 'src/**/__test__/**/*.js';

    if (file) {
      // Do not run tests when changed something not JS
      if (!/\.(js|jsx)?$/.test(file.path)) {
        console.log(`Change happend on '${file.path}' but it is not valid JS file`); // eslint-disable-line no-console
        return null;
      }

      if (file.path.indexOf('__test__') !== -1)
        source = file.path;
      else {
        const parts = file.path.split(path.sep);
        const filename = parts.pop(1);
        const dir = parts.join(path.sep);
        source = `${dir}/__test__/${filename.split('.')[0]}*.js`;
      }
    }

    console.log(`Running ${source}`); // eslint-disable-line no-console
    const jenkins = errorReporter === 'jenkins';
    gulp.src(source, {read: false})
      .pipe(mocha({
        require: ['./test/mochaSetup.js'],
        reporter: jenkins ? 'mocha-junit-reporter': 'spec',
        reporterOptions: jenkins ? {
          mochaFile: './test/output/mocha.xml',
        } : {},
      }))
      .on('error', reportError(errorReporter));
  };
}
