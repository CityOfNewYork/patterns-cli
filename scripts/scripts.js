#!/usr/bin/env node

const shell = require('shelljs');
const nodemon = require('nodemon');
const alerts = require(`${process.env.PWD}/config/alerts`);

const config = './config/rollup.js';
const pathToConfig = `${process.env.PWD}/config/rollup.js`;

const argvs = process.argv.slice(2);

const args = {
  noisy: (argvs.includes('-n') || argvs.includes('--noisy')),
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

shell.config.silent = (args.noisy) ? false : true;

if (args.watch) {
  let noisy = args.noisy ? '-n' : '';
  nodemon(`-e js -w ${process.env.PWD}/src/ -x ${__dirname}/scripts.js ${noisy}`);

  console.log(`${alerts.watching} Scripts watching ${alerts.ext('.js')} in ${alerts.path('./src/')}`);
} else {
  shell.exec(`npx rollup -c ${pathToConfig}`, (code, stdout, stderr) => {
    if (code) {
      console.log(`${alerts.error} "scripts" failed: ${stderr}`);

      process.exit(1);
    } else {
      console.log(`${alerts.rollup} Rolled up scripts defined in ${alerts.path(config)}`);
    }
  });
}