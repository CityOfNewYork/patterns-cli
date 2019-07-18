const concurrently = require('concurrently');
const nodemon = require('nodemon');
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  nodemon(`-e scss,js,svg --watch src -x node ${__dirname}/default.js --ignore _variables.scss`);
} else {
  concurrently([
    `node ${__dirname}/svgs.js`,
    `node ${__dirname}/styles.js`,
    `node ${__dirname}/scripts.js`,
    `node ${__dirname}/build.js`
  ], {
    prefix: 'none'
  });
}