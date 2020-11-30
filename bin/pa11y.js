#!/usr/bin/env node

/**
 * Dependencies
 */

const pa11y = require('pa11y');
const path = require('path');
const fs = require('fs');

const args = require(`${__dirname}/util/args`).args;
const resolve = require(`${__dirname}/util/resolve`);
const cnsl = require(`${__dirname}/util/console`);

const config = resolve('config/pa11y');
const alerts = resolve('config/alerts');

/**
 * Constants
 */

const DIST = path.join(process.env.PWD, 'dist');
const BASE_PATH = DIST;
const EXT = '.html';
const IGNORE = [
  'scripts',
  'styles',
  'svg',
  'utilities',
  'elements',
  'components',
  'objects'
];

/**
 * a11y Linter
 *
 * @param  {String}  file  Glob or file path to lint
 *
 * @return                 Linting data
 */
const a11y = async (file = `${process.env.PWD}/dist/index.html`) => {
  if (!args.nondescript && !args.silent) {
    cnsl.lint(`${alerts.accessible} Running Pa11y CI on ${alerts.str.path(file)}`);
  }

  let results = await pa11y(file, config);

  if (results.issues.length) {
    if (args.nondescript || args.silent) {
      cnsl.lint(`${alerts.str.path(results.pageUrl)}`);
    } else {
      cnsl.lint(`${alerts.accessible} Pa11y suggestions for ${alerts.str.path(results.pageUrl)}`);
    }

    results.issues.forEach((issue) => {
      cnsl.lint([
        `${alerts.str.string(issue.context)}\n`,
        `${alerts.str.comment(issue.code.split(',').pop())}\t`,
        (issue.type === 'error') ? alerts.str.error('error') : alerts.str.warning('warn'),
        `\t${issue.message}`
      ].join(''));
    });
  } else {
    if (!args.nondescript && !args.silent) {
      cnsl.lint(`${alerts.accessible} No Pa11y suggestions for ${alerts.str.path(results.pageUrl)}`);
    }
  }

  return results;
};

/**
 * Main script
 *
 * @param  {String}  file  Glob or file path to lint
 */
const main = async (file) => {
  try {
    await a11y(file);

    return file;
  } catch (err) {
    cnsl.error(`Pa11y failed (main): ${err.stack}`);
  }
};

/**
 * Read a specific file or if it's a directory, read all of the files in it
 *
 * @param  {String}  file  A single file or directory to recursively walk
 * @param  {String}  dir   The base directory of the file
 */
const walk = async (file, dir = BASE_PATH) => {
  file = (file.includes(dir)) ? file : path.join(dir, file);

  if (file.includes(EXT)) {
    await main(file);
  } else if (!IGNORE.some(folder => file.includes(folder))) {
    try {
      let files = fs.readdirSync(file, 'utf-8');

      for (let i = files.length - 1; i >= 0; i--) {
        await walk(files[i], file);
      }
    } catch (err) {
      cnsl.error(`Pa11y failed (walk): ${err.stack}`);
    }
  }
};

/**
 * Runner for the script
 *
 * @param  {String}  dir  The base directory of the file
 */
const run = async (dir = BASE_PATH) => {
  await walk(dir);

  cnsl.success(`Pa11y finished`);

  process.exit();
};

/**
 * Export our methods
 *
 * @type {Object}
 */
module.exports = {
  main: main,
  run: run,
  config: config
};
