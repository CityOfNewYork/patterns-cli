const shell = require('shelljs');
const nodemon = require('nodemon');
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  nodemon(`-e scss --watch src --ignore _variables.scss -x node ${__dirname}/styles.js`);
} else {
  shell.exec(`node ${__dirname}/variables.js`);
  shell.exec(`node ${__dirname}/sass.js`);
  shell.exec(`node ${__dirname}/postcss.js`);
}