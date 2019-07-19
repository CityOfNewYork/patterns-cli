const shell = require('shelljs');
const nodemon = require('nodemon');
const alerts = require(`${process.env.PWD}/config/alerts`);
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  nodemon(`-e scss -w ${process.env.PWD}/src --ignore _variables.scss -x node ${__dirname}/styles.js`);

  console.log(`${alerts.watching} Styles watching ${alerts.ext('.scss')} in ${alerts.path('./src')}`);
} else {
  shell.exec(`node ${__dirname}/variables.js`);
  shell.exec(`node ${__dirname}/sass.js`);
  shell.exec(`node ${__dirname}/postcss.js`);
}