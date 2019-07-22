#!/usr/bin/env node

const nodemon = require('nodemon');
const alerts = require(`${process.env.PWD}/config/alerts`);

const argvs = process.argv.slice(2);

const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

if (args.watch) {
  nodemon(`-e scss -w ${process.env.PWD}/src --ignore _variables.scss -x ${__dirname}/styles.js`);

  console.log(`${alerts.watching} Styles watching ${alerts.ext('.scss')} in ${alerts.path('./src/')}`);
} else {
  require(`${__dirname}/variables.js`);
  require(`${__dirname}/sass.js`);
  require(`${__dirname}/postcss.js`);
}