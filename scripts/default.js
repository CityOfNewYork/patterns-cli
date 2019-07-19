const concurrently = require('concurrently');
const nodemon = require('nodemon');
const args = process.argv.slice(2);

let watch = (args.includes('-w') || args.includes('--watch')) ? ' --watch': '';

concurrently([
  `node ${__dirname}/svgs.js ${watch}`,
  `node ${__dirname}/styles.js ${watch}`,
  `node ${__dirname}/scripts.js ${watch}`,
  `node ${__dirname}/build.js ${watch}`
], {
  prefix: 'none',
  raw: true
});