#!/usr/bin/env node

const nodemon = require('nodemon');
const concurrently = require('concurrently');
const alerts = require(`${process.env.PWD}/config/alerts`);

const argvs = process.argv.slice(2);

const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

if (args.watch) {
  nodemon(`-e scss -w ${process.env.PWD}/src --ignore _variables.scss -x ${__dirname}/styles.js`);

  console.log(`${alerts.watching} Styles watching ${alerts.ext('.scss')} in ${alerts.path('./src/')}`);
} else {
  let config = {
    prefix: 'none',
    raw: true
  };

  concurrently([`node ${__dirname}/variables.js`], config).then(
    concurrently([`node ${__dirname}/sass.js`], config).then(
      concurrently([`node ${__dirname}/postcss.js`], config).then(
        () => { console.log(`${alerts.success} Styles finished`); },
        () => { console.log(`${alerts.error} PostCSS failed`); }
      ),
      () => { console.log(`${alerts.error} Sass failed`); }
    ),
    () => { console.log(`${alerts.error} Variables failed`); }
  );
}