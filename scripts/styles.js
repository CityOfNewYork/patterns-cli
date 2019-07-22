#!/usr/bin/env node

const shell = require('shelljs');
const nodemon = require('nodemon');
const alerts = require(`${process.env.PWD}/config/alerts`);

const argvs = process.argv.slice(2);

const args = {
  noisy: (argvs.includes('-n') || argvs.includes('--noisy')),
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

let noisy = args.noisy ? '-n' : '';

if (args.watch) {
  nodemon(`-e scss -w ${process.env.PWD}/src --ignore _variables.scss -x ${__dirname}/styles.js ${noisy}`);

  console.log(`${alerts.watching} Styles watching ${alerts.ext('.scss')} in ${alerts.path('./src/')}`);
} else {
  shell.exec(`node ${__dirname}/variables.js ${noisy}`);
  shell.exec(`node ${__dirname}/sass.js ${noisy}`);
  shell.exec(`node ${__dirname}/postcss.js ${noisy}`);
}