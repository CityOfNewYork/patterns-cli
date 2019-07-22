#!/usr/bin/env node

const concurrently = require('concurrently');
const args = process.argv.slice(2);

let watch = (args.includes('-w') || args.includes('--watch')) ? '-w': '';

concurrently([
  `node ${__dirname}/svgs.js ${watch}`,
  `node ${__dirname}/styles.js ${watch}`,
  `node ${__dirname}/scripts.js ${watch}`,
  `node ${__dirname}/build.js ${watch}`
], {
  prefix: 'none',
  raw: true
});