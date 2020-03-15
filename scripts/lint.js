#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const path = require('path');
const stylelint = require('stylelint');
const eslint = require('eslint').CLIEngine;
const config = require(`${process.env.PWD}/config/lint`);
const alerts = require(`${process.env.PWD}/config/alerts`);
const cnsl = require(`${__dirname}/util/console`);

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

    if (eslinter.errorCount) {
      eslinter.results.forEach((item) => {
        if (item.messages.length) {
          if (args.nondescript || args.silent) {
            cnsl.lint(`${alerts.str.path(item.filePath.replace(`file://${process.env.PWD}`, '.'))}`);
          } else {
            cnsl.lint(`${alerts.info} Suggestions for ${alerts.str.path(item.filePath.replace(process.env.PWD, '.'))}`);
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
      JSON.parse(data.output).forEach((item) => {
        if (item.errored) {
          if (args.nondescript || args.silent) {
            cnsl.lint(`${alerts.str.path(item.source.replace(process.env.PWD, '.'))}`);
          } else {
            cnsl.lint(`${alerts.info} Linting Suggestions for ${alerts.str.path(item.source.replace(process.env.PWD, '.'))}`);
          }

          item.warnings.forEach((warning) => {
            let capture = /\(([^)]+)\)/;
            let ruleId = capture.exec(warning.text)[1];

            cnsl.lint([
              alerts.str.comment(warning.line + ':' + warning.column),
              (warning.severity === 'error') ? alerts.str.error('error') : alerts.str.warning('warn'),
              `${warning.text.split(' (')[0]}. ${alerts.str.comment(ruleId)}`
            ].join('\t'));
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

/** @type {Object} Export our methods */
module.exports = {
  main: main,
  run: run
};
