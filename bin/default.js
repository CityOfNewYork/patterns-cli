#!/usr/bin/env node

/**
 * Dependencies
 */

const concurrently = require('concurrently');

/**
 * Args
 */

const arguments = require(`${__dirname}/util/args`);
const args = arguments.args;
const dict = arguments.dict;

const flags = dict.map(d => (args[d.name]) ? d.flags[0] : '')
  .filter(f => f != '').join(' ');

/**
 * Constants
 */

const scripts = [
  'styles',
  'rollup',
  'slm',
  'svgs'
];

const opts = {
  prefix: 'none',
  raw: true
};

/**
 * Main task
 */
const main = () => {
  concurrently(scripts.map(s => `${__dirname}/cli.js ${s} ${flags}`), opts)
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
