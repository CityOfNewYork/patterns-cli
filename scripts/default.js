#!/usr/bin/env node

const concurrently = require('concurrently');

/** Process CLI args */

const args = require(`${__dirname}/util/args`).args;

let flags = [
  (args.watch) ? '-w' : '',
  (args.silent) ? '-s' : '',
  (args.nondescript) ? '-nd' : ''
].join(' ');

concurrently([
  `node ${__dirname}/cli.js styles ${flags}`,
  `node ${__dirname}/cli.js rollup ${flags}`,
  `node ${__dirname}/cli.js slm ${flags}`,
  `node ${__dirname}/cli.js svgs ${flags}`
], {
  prefix: 'none',
  raw: true
});