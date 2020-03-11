#!/usr/bin/env node

const concurrently = require('concurrently');
const args = process.argv.slice(2);

let watch = (args.includes('-w') || args.includes('--watch')) ? '-w': '';

concurrently([
  `node ${__dirname}/cli.js styles ${watch}`,
  `node ${__dirname}/rollup.js ${watch}`,
  `node ${__dirname}/cli.js slm ${watch}`,
  `node ${__dirname}/cli.js svgs ${watch}`
], {
  prefix: 'none',
  raw: true
});