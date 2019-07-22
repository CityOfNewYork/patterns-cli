#!/usr/bin/env node

const shell = require('shelljs');
const nodemon = require('nodemon');
const alerts = require(`${process.env.PWD}/config/alerts`);

const argvs = process.argv.slice(2);

const args = {
  noisy: (argvs.includes('-n') || argvs.includes('--noisy')),
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

shell.config.silent = (args.noisy) ? false : true;

if (args.watch) {
  let noisy = args.noisy ? '-n' : '';

  nodemon(`-e svg -w ${process.env.PWD}/src/svg -x ${__dirname}/svgs.js ${noisy}`);

  console.log(`${alerts.watching} Svgs watching ${alerts.ext('.svg')} in ${alerts.path('./src/svg/')}`);
} else {
  shell.exec(`npx svgo -f ${process.env.PWD}/src/svg -o ${process.env.PWD}/dist/svg --disable=convertPathData`, (code, stdout, stderr) => {
    if (code) {
      console.log(`${alerts.error} "svgs" failed: ${stderr}`);
    } else {
      console.log(`${alerts.compression} Svgs from ${alerts.path('./src/svg/')} optimized to ${alerts.path('./dist/svg/')}`);
    }

    shell.exec(`npx svgstore -o ${process.env.PWD}/dist/icons.svg ${process.env.PWD}/dist/svg/*.svg --inline`, (code, stdout, stderr) => {
      if (code) {
        console.log(`${alerts.error} "svgs" failed: ${stderr}`);

        process.exit(1);
      } else {
        console.log(`${alerts.package} Created ${alerts.path('./dist/icons.svg')} sprite from svgs in ${alerts.path('./dist/svg/')}`);
      }
    });
  });
}