#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const chokidar = require('chokidar');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/sample`);

/**
 * Constants
 */

const GLOBS = [
  './src/**/*'
];

/**
 * Process CLI args
 */

const argvs = process.argv.slice(2);
const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

/**
 * Our Chokidar Watcher
 *
 * @param  {Source}  url  https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(GLOBS.map(glob => path.join(process.env.PWD, glob)), {
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 750
  }
});

/**
 * Main script
 */
const main = async () => {
  try {
    // Main functionality. Call other async functions here.
  } catch (err) {
    console.log(`${alerts.error} Sample failed (main): ${err}`);
  }
};

/**
 * Runner for the sample script
 */
const run = async () => {
  if (args.watch) {
    try {
      watcher.on('change', changed => {
        let local = changed.replace(process.env.PWD, '');

        await main();

        console.log(`${alerts.watching} Detected change on ${alerts.path(`.${local}`)}`);
      });

      console.log(`${alerts.watching} Sample watching ${alerts.ext(GLOBS.join(', '))}`);
    } catch (err) {
      console.error(`${alerts.error} Sample (run): ${err}`);
    }
  } else {
    await main();

    process.exit();
  }
};

/** @type  {Object}  Export our methods */
module.exports = {
  'main': main,
  'run': run,
  'config': config
};
