#!/usr/bin/env node

const concurrently = require('concurrently');
const args = process.argv.slice(2);

let watch = (args.includes('-w') || args.includes('--watch')) ? '-w': '';

concurrently([
  `node ${__dirname}/styles.js ${watch}`,
  `node ${__dirname}/rollup.js ${watch}`,
  `node ${__dirname}/slm.js ${watch}`,
  `node ${__dirname}/svgs.js ${watch}`
], {
  prefix: 'none',
  raw: true
});