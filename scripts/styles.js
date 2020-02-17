#!/usr/bin/env node

/**
 * Dependencies
 */

const chokidar = require('chokidar');
const path = require('path');
const alerts = require(`${process.env.PWD}/config/alerts`);
const tokens = require(`${__dirname}/tokens`);
const tokensOpts = require(`${process.env.PWD}/config/tokens`).opts;
const sass = require(`${__dirname}/sass`);
const postcss = require(`${__dirname}/postcss`);
const globs = [
  './src/**/*.scss',
  tokens.input
];

/**
 * Process CLI args
 */

const argvs = process.argv.slice(2);
const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch')),
  silent: (argvs.includes('-s') || argvs.includes('--silent'))
};

/**
 * Development Mode
 */

let modules = require(`${process.env.PWD}/config/sass`);

if (process.env.NODE_ENV === 'development') {
  modules = modules.filter(file => file.devModule);
}

/**
 * Silent
 */

console.log = (args.silent) ? () => {} : console.log;

/**
 * Methods
 */

 /**
 * Run each task on the modules
 *
 * @param  {Array}  modules  The contents of config/sass.js
 */
const main = async (modules) => {
  await tokens.run();
  await sass.run(modules);
  await postcss.run(modules);

  console.log(`${alerts.success} Styles finished`);
};

/**
 * Our Chokidar Watcher
 *
 * @param  {Source}  url  https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(globs.map(glob => path.join(process.env.PWD, glob)), {
  ignored: path.join(process.env.PWD, tokensOpts.output.replace(/"/g, '')),
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 750
  }
});

/**
 * Tne runner for single commands and the watcher
 *
 * @param   {Array}  styles  The contents of config/sass.js
 */
const run = async (styles = modules) => {
  try {
    if (args.watch) {
      watcher.on('change', (changed) => {
        let local = changed.replace(process.env.PWD, '');
        let styls = [];

        console.log(`${alerts.watching} Detected change on ${alerts.path(`.${local}`)}`);

        if (process.env.NODE_ENV !== 'development') {
          let filtered = styles.filter(mod => path.basename(changed) === path.basename(mod.file));

          styls = (filtered.length) ? filtered : styles;
        } else {
          styls = styles;
        }

        main(styls);
      });

      console.log(`${alerts.watching} Styles watching ${alerts.ext(globs)}`);
    } else {
      await main(modules);

      process.exit(0);
    }
  } catch (err) {
    console.log(`${alerts.error} Styles failed: ${err}`);
  }
};

/** @type  {Object}  Export our method */
module.exports = {
  globs: globs,
  main: main,
  run: run
};
