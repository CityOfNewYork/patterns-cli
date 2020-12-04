#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

/**
 * Config file for this script
 */

const config = require(`${process.env.PWD}/config/_sample`);

/**
 * @pttrn Dependencies
 */

const pttrn = `${process.env.PWD}/node_modules/@nycopportunity/patterns-framework`;
const alerts = require(`${pttrn}/config/alerts`);
const args = require(`${pttrn}/bin/util/args`).args;
const cnsl = require(`${pttrn}/bin/util/console`);

/**
 * Constants
 */

const SRC = config.src;
const DIST = config.dist;
const ENTRY = config.entry;
const EXT = config.ext;
const GLOBS = [
  `${config.src}/${config.dist}/**/*${config.ext}`
];

/**
 * Our Chokidar Watcher
 *
 * @source https://github.com/paulmillr/chokidar
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
 * @param   {String}     file  The file source
 * @param   {Object}     data  The data to pass to the file
 *
 * @return  {Undefined}        The result of fs.writeFileSync()
 */
const write = async (file, data) => {
  try {
    let dist = file.replace(SRC, DIST);

    if (!fs.existsSync(path.dirname(dist))) {
      fs.mkdirSync(path.dirname(dist), {recursive: true});
    }

    let written = fs.writeFileSync(dist, data);

    cnsl.describe(`${alerts.success} ${alerts.str.path(file)} written to ${alerts.str.path(dist)}`);

    return written;
  } catch (err) {
    cnsl.error(`Failed (write): ${err.stack}`);
  }
}

/**
 * A sample file read and replace method
 *
 * @param   {String}  file  Path to the file
 *
 * @return  {String}        File contents
 */
const replace = async (file) => {
  let data = await fs.readFileSync(file, 'utf-8');

  return data.replace('{{ source }}', 'distribution');
};

/**
 * The main task bus for transforming contents of a source file
 *
 * @param   {String}  file  Path to source file
 *
 * @return  {String}        Transformed data
 */
const main = async (file) => {
  try {
    let data = await replace(file); // Do something with the file data here

    await write(file, data);

    return data;
  } catch (err) {
    cnsl.error(`Failed (main): ${err.stack}`);
  }
};

/**
 * Read a specific file, if it is a directory read all of the files in it,
 * then, perform the main task on the file.
 *
 * @param  {String}  file  A single file or directory to recursively walk
 */
const walk = async (file) => {
  if (file.includes(EXT)) {
    await main(file);
  } else {
    try {
      let files = fs.readdirSync(file, 'utf-8');

      for (let i = files.length - 1; i >= 0; i--) {
        await walk(files[i], file);
      }
    } catch (err) {
      cnsl.error(`Failed (walk): ${err.stack}`);
    }
  }
};

/**
 * Runner for the sample script. If the -w or --watch flag is passed it will
 * run the watcher method. If a single filename is passed it will run the
 * main task on the file.
 *
 * @type {Function}
 */
const run = async () => {
  if (args.watch) {
    try {
      watcher.on('change', async changed => {
        cnsl.watching(`Detected change on ${alerts.str.path(changed)}`);

        await main(changed);
      });

      cnsl.watching(`Sample watching ${alerts.str.ext(GLOBS.join(', '))}`);
    } catch (err) {
      cnsl.error(`Failed (run): ${err.stack}`);
    }
  } else {
    let file = (process.argv[2]) ? process.argv[2] : false;

    if (file) {
      await main(`${SRC}/${ENTRY}/${file}`);
    } else {
      cnsl.error(`Failed (run): A file needs to be passed as an argument or a directory with files needs to be present if not using the ${alerts.str.string('--watch')} flag.`);
    }

    process.exit(); // One-off commands must exit
  }
};

/**
 * Export our methods
 *
 * @type {Object}
 */
module.exports = {
  run: run
};
