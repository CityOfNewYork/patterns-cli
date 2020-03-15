#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const alerts = require(`${process.env.PWD}/config/alerts`);
// Create a config file for this script
// const config = require(`${process.env.PWD}/config/sample`);

/**
 * Constants
 */

const SOURCE = path.join(process.env.PWD, opts.src);
const DIST = path.join(process.env.PWD, opts.dist);
const BASE_PATH = `${SOURCE}/${opts.views}`;

const EXT = '.ext';
const GLOBS = [
  `${SOURCE}/**/*${EXT}`
];

/** Process CLI args */

const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);

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
 * Write file to the distribution folder
 *
 * @param   {String}    file   The file source
 * @param   {Object}    data   The data to pass to the file
 * @return  {undefined}        The result of fs.writeFileSync()
 */
const write = async (file, data) => {
  try {
    let dist = file.replace(BASE_PATH, path.join(DIST, opts.svgs));
    let local = dist.replace(process.env.PWD, '.');

    if (!fs.existsSync(path.dirname(dist))){
      fs.mkdirSync(path.dirname(dist));
    }

    let written = fs.writeFileSync(dist, data);

    cnsl.describe(`Sample written to ${alerts.str.path(local)}`);

    return written;
  } catch (err) {
    cnsl.error(`Sample (write): ${err.stack}`);
  }
}

/**
 * Main script
 */
const main = async (file) => {
  try {
    // Main functionality. Call other async functions here.
    // let data = await ...(file)

    await write(file, data);

    return data;
  } catch (err) {
    cnsl.error(`Sample failed (main): ${err.stack}`);
  }
};

/**
 * Runner for the sample script
 */
const run = async () => {
  if (args.watch) {
    try {
      watcher.on('change', async changed => {
        let local = changed.replace(process.env.PWD, '');

        await main(changed);

        cnsl.watching(`Detected change on ${alerts.str.path(`.${local}`)}`);
      });

      cnsl.watching(`Sample watching ${alerts.str.ext(GLOBS.map(g => g.replace(process.env.PWD, '')).join(', '))}`);
    } catch (err) {
      cnsl.error(`Sample (run): ${err.stack}`);
    }
  } else {
    await main();

    process.exit();
  }
};

/** @type {Object} Export our methods */
module.exports = {
  main: main,
  run: run,
  config: config
};
