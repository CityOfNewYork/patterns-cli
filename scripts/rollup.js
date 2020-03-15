#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const path = require('path');
const rollup = require('rollup');
const chokidar = require('chokidar');
const alerts = require(`${process.env.PWD}/config/alerts`);
const lint = require(`${__dirname}/lint`);

/**
 * Constants
 */

const SOURCE = path.join(process.env.PWD, 'src');
const DIST = path.join(process.env.PWD, 'dist');
const EXT = '.js';

const GLOBS = [
  `${SOURCE}/**/*${EXT}`
];

/** Process CLI args */

const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);
/**
 * Development Mode
 */

let modules = require(`${process.env.PWD}/config/rollup`);

if (process.env.NODE_ENV === 'development') {
  modules = modules.filter(file => file.devModule);
}

/**
 * Our Chokidar Watcher
 *
 * @param  {Source}  url  https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(GLOBS, {
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 750
  }
});

/**
 * Main script process
 *
 * @param  {Array}  script  A rollup configuration object https://rollupjs.org/guide/en/#using-config-files
 */
const main = async (script) => {
  try {
    /** Lint file */
    if (!args.nolint) await lint.main(script.input);

    if (script.hasOwnProperty('devModule')) delete script.devModule;

    const bundle = await rollup.rollup(script);
    const local = script.input.replace(process.env.PWD, '.');
    const dist = DIST.replace(process.env.PWD, '.');

    for (let i = 0; i < script.output.length; i++) {
      await bundle.write(script.output[i]);
    }

    cnsl.describe(`${alerts.rollup} Rollup bundle written to ${alerts.str.path(dist)} for ${alerts.str.path(local)}`);
  } catch (err) {
    cnsl.error(`Rollup failed (main): ${err.stack}`);
  }
};

/**
 * Runner for the sample script
 */
const run = async (scripts = modules) => {
  if (args.watch) {
    try {
      watcher.on('change', async changed => {
        let local = changed.replace(process.env.PWD, '');
        let scrpts = [];

        cnsl.watching(`Detected change on ${alerts.str.path(`.${local}`)}`);

        if (process.env.NODE_ENV !== 'development') {
          let filtered = scripts.filter(s => path.basename(changed) === path.basename(s.input));

          scrpts = (filtered.length) ? filtered : scripts;
        } else {
          scrpts = scripts;
        }

        for (let i = 0; i < scrpts.length; i++) {
          await main(scrpts[i]);
        }
      });

      cnsl.watching(`Rollup watching ${alerts.str.ext(GLOBS.map(g => g.replace(process.env.PWD, '.')).join(', '))}`);
    } catch (err) {
      console.error(`${alerts.error} Rollup (run): ${err.stack}`);
    }
  } else {
    for (let i = 0; i < scripts.length; i++) {
      await main(scripts[i]);
    }

    cnsl.success(`Rollup finished`);

    process.exit();
  }
};

/** @type {Object} Export our methods */
module.exports = {
  main: main,
  run: run,
  modules: modules
};
