#!/usr/bin/env node

const concurrently = require('concurrently');

/** Process CLI args */

const arguments = require(`${__dirname}/util/args`);
const args = arguments.args;
const dict = arguments.dict;

let flags = dict.map(d => (args[d.name]) ? d.flags[0] : '')
  .filter(f => f != '').join(' ');

concurrently([
  `node ${__dirname}/cli.js styles ${flags}`,
  `node ${__dirname}/cli.js rollup ${flags}`,
  `node ${__dirname}/cli.js slm ${flags}`,
  `node ${__dirname}/cli.js svgs ${flags}`
], {
  prefix: 'none',
  raw: true
});