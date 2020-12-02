#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const path = require('path');
const stylelint = require('stylelint');
const eslint = require('eslint').CLIEngine;

const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);

const config = resolve('config/lint');
const alerts = resolve('config/alerts');

/**
 * Constants
 */

const SOURCE = path.join(process.env.PWD, 'src');

const EXT_ES = '.js';
const EXT_STYLE = '.scss';
const GLOBS = [
  `${SOURCE}/**/*${EXT_ES}`,
  `${SOURCE}/**/*${EXT_STYLE}`
];

/** Process CLI args */

const args = require(`${__dirname}/util/args`).args;

/**
 * ES Linter
 *
 * @param  {String}  file  Glob or file path to lint
 *
 * @return                 Linting data
 */
const es = async (file = GLOBS.find(g => g.includes(EXT_ES))) => {
  try {
    let eslinter = new eslint(config.eslint).executeOnFiles([file]);

    if (eslinter.errorCount || eslinter.warningCount) {
      eslinter.results.forEach((item) => {
        if (item.messages.length) {
          if (args.nondescript || args.silent) {
            cnsl.lint(`${alerts.str.path(item.filePath)}`);
          } else {
            cnsl.lint(`${alerts.info} ESLint suggestions for ${alerts.str.path(item.filePath)}`);
          }

          item.messages.forEach((message) => {
            cnsl.lint([
              alerts.str.comment(message.line + ':' + message.column),
              (message.severity < 2) ? alerts.str.warning('warn') : alerts.str.error('error'),
              `${message.message} ${alerts.str.comment(message.ruleId)}`
            ].join('\t'));
          });
        }
      });
    }

    return eslinter.results;
  } catch (err) {
    cnsl.error(`Lint (run): ${err.stack}`);
  }
};

/**
 * Style Linter
 *
 * @param  {String}  file  Glob or file path to lint
 *
 * @return                 Linting data
 */
const style = async (file = GLOBS.find(g => g.includes(EXT_STYLE))) => {
  try {
    let data = await stylelint.lint({
      files: file,
      config: config.stylelint
    })

    if (data.errored) {
      data.results.forEach((item) => {
        if (item.errored) {
          if (args.nondescript || args.silent) {
            cnsl.lint(`${alerts.str.path(item.source)}`);
          } else {
            cnsl.lint(`${alerts.info} stylelint suggestions for ${alerts.str.path(item.source)}`);
          }

          item.warnings.forEach(warning => {
            let capture = /\(([^)]+)\)/;
            let ruleId = capture.exec(warning.text)[1];

            cnsl.lint([
              alerts.str.comment(warning.line + ':' + warning.column),
              (warning.severity === 'error') ? alerts.str.error('error') : alerts.str.warning('warn'),
              `${warning.text.split(' (')[0]}. ${alerts.str.comment(ruleId)}`
            ].join('\t'));
          });

          item.invalidOptionWarnings.forEach(warning => {
            cnsl.lint(`${alerts.str.comment('lint.js')}\t${alerts.str.warning('warn')}\t${warning.text}`);
          });

          item.deprecations.forEach(warning => {
            cnsl.lint(`${alerts.str.comment('n/a')}\t${alerts.str.warning('warn')}\t${JSON.stringify(warning)}`);
          });

          item.parseErrors.forEach(warning => {
            cnsl.lint(`${alerts.str.comment('n/a')}\t${alerts.str.error('error')}\t${JSON.stringify(warning)}`);
          });
        }
      });
    }

    return data;
  } catch (err) {
    cnsl.error(`Lint (run): ${err.stack}`);
  }
};

/**
 * Main script
 *
 * @param  {String}  file  Glob or file path to lint
 *
 * @return                 File
 */
const main = async (file = false) => {
  try {
    if (!file) {
      await es();

      await style();

      return;
    }

    let ext = path.extname(file);

    if (ext === EXT_ES) await es(file);

    if (ext === EXT_STYLE) await style(file);

    return file;
  } catch (err) {
    cnsl.error(`Lint failed (main): ${err.stack}`);
  }
};

/**
 * Runner for the sample script
 */
const run = async () => {
  await main();

  cnsl.success(`Lint finished`);

  process.exit();
};

/**
 * Export our methods
 *
 * @type {Object}
 */
module.exports = {
  main: main,
  run: run
};
