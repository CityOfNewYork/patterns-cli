#!/usr/bin/env node

const shell = require('shelljs');
const nodemon = require('nodemon');
const alerts = require(`${process.env.PWD}/config/alerts`);

const input = './config/variables.js';
const output = './src/config/_variables.scss';

const argvs = process.argv.slice(2);

const args = {
  noisy: (argvs.includes('-n') || argvs.includes('--noisy')),
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

shell.config.silent = (args.noisy) ? false : true;

if (args.watch) {
  let noisy = args.noisy ? '-n' : '';

  nodemon(`-e js --watch ${process.env.PWD}/config/variables.js -x ${__dirname}/variables.js ${noisy}`);

  console.log(`${alerts.watching} Variables watching ${alerts.path(input)}`);
} else {
  shell.exec(`npx json-to-scss ${input} ${output} --p='$variables:'`, (code, stdout, stderr) => {
    if (code) {
      console.log(`${alerts.error} "variables" failed: ${stderr}`);

      process.exit(1);
    } else {
      console.log(`${alerts.scripts} Created ${alerts.path(output)} from ${alerts.path(input)}`);
    }
  });
}