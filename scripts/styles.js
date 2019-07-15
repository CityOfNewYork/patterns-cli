// const concurrently = require('concurrently');
const shell = require('shelljs');
const nodemon = require('nodemon');
const args = process.argv.slice(2);
// const prefix = '[styles]';

if (args.includes('-w') || args.includes('--watch')) {
  nodemon('-e scss --watch src --ignore _variables.scss -x pttrn styles');
} else {
  shell.exec('pttrn variables');
  shell.exec('pttrn sass');
  shell.exec('pttrn postcss');
}