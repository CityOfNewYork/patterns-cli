#!/usr/bin/env node

/**
 * Dependencies
 */

const concurrently = require('concurrently');
const resolve = require(`${__dirname}/util/resolve`);
const cnsl = require(`${__dirname}/util/console`);

/**
 * Args
 */

const config = resolve('config/default.js');
const arguments = require(`${__dirname}/util/args`);
const args = arguments.args;
const dict = arguments.dict;

const flags = dict.map(d => (args[d.name]) ? d.flags[0] : '')
  .filter(f => f != '').join(' ');

/**
 * Constants
 */

const scripts = config.commands;
const opts = config.concurrently;

/**
 * Main task
 */
const main = () => {
  try {
    const result = concurrently(scripts.map(s => `"${__dirname}/cli.js" ${s} ${flags}`), opts);

    result.then(() => {
      cnsl.success(`pttrn command (default) finished`);
    }, (error) => {
      error.forEach(err => {
        cnsl.error(`pttrn command (default) failed with exit code ${err.exitCode}: ${err.command.command}`);
      });
    });
  } catch (error) {
    cnsl.error(`pttrn command (default) failed`);
  }
};

/**
 * Runner
 */
const run = () => {
  main();
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
