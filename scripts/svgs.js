#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const svgolib = require('svgo/lib/svgo');
const svgstore = require('svgstore');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/svgs`);
const opts = config.config;
const plugins = {
  plugins: Object.keys(config.svgo).map((p) => {p: config.svgo[p]})
};

/**
 * Constants
 */

const SOURCE = path.join(process.env.PWD, opts.src);
const DIST = path.join(process.env.PWD, opts.dist);
const BASE_PATH = `${SOURCE}/${opts.svgs}`;
const FILE = path.join(process.env.PWD, opts.dist, opts.svgs, config.svgstore.file);

const EXT = '.svg';
const GLOBS = [
  `${BASE_PATH}/**/*${EXT}`
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
const watcher = chokidar.watch(GLOBS, {
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 750
  }
});

/**
 * Write the svg file to the distribution folder
 *
 * @param   {String}    file   The file source
 * @param   {Object}    data   The data to pass to the file
 * @param   {Boolean}   store  Flag for wether the store is being written or not
 * @return  {undefined}        The result of fs.writeFileSync()
 */
const write = async (file, data, store = false) => {
  try {
    let dist = file.replace(BASE_PATH, path.join(DIST, opts.svgs));
    let src = file.replace(process.env.PWD, '.');
    let local = dist.replace(process.env.PWD, '.');

    if (!fs.existsSync(path.dirname(dist))){
      fs.mkdirSync(path.dirname(dist));
    }

    let written = fs.writeFileSync(dist, data);

    if (store) {
      console.log(`${alerts.package} Svgs sprite written to ${alerts.path(local)}`);
    } else {
      console.log(`${alerts.compression} Svgs optimized ${alerts.path(src)} and saved to ${alerts.path(local)}`);
    }

    return written;
  } catch (err) {
    console.log(`${alerts.error} Svgs (write): ${err.stack}`);
  }
}

/**
 * Create a new store
 */
let SPRITE = new svgstore();

/**
 * Add a file and it's data to the store
 *
 * @param  {String}  file  The filename of the svg
 * @param  {String}  data  The raw contents of the file
 * @return {Object}        The svg sprite
 */
const store = async (file, data) => {
  try {
    let name = path.basename(file).replace(path.extname(file), '');

    SPRITE = SPRITE.add(`${config.svgstore.prefix}${name}`, data);

    return SPRITE;
  } catch (err) {
    console.log(`${alerts.error} Svgs failed (store): ${err}`);
  }
};

/**
 * Optimize an svg by it's filename
 *
 * @param  {String}  file  The filename of the svg
 * @return {String}        The optimized svg file contents
 */
const optimize = async (file) => {
  try {
    let svgo = new svgolib(plugins);

    let data = fs.readFileSync(file, 'utf-8');

    let optimized = await svgo.optimize(data, {path: file});

    return optimized.data;
  } catch (err) {
    console.log(`${alerts.error} Svgs failed (optimize): ${err}`);
  }
};

/**
 * The main function for the svg script
 *
 * @param  {String}  file  The filename of the svg
 * @return {String}        The optimized svg file contents
 */
const main = async (file) => {
  try {
    let optimized = await optimize(file);

    await store(file, optimized);

    await write(file, optimized);

    return optimized;
  } catch (err) {
    console.log(`${alerts.error} Svgs failed (main): ${err}`);
  }
};

/**
 * Read a specific file or if it's a directory, read all of the files in it
 *
 * @param  {String}  file  A single file or directory to recursively walk
 * @param  {String}  dir   The base directory of the file
 */
const walk = async (file, dir = BASE_PATH) => {
  file = (file.includes(dir)) ? file : path.join(dir, file);

  if (file.includes(EXT)) {
    await main(file);
  } else {
    try {
      let files = fs.readdirSync(file, 'utf-8');

      for (let i = files.length - 1; i >= 0; i--) {
        await walk(files[i], file);
      }
    } catch (err) {
      console.log(`${alerts.error} Svgs failed (walk): ${err}`);
    }
  }
};


/**
 * Runner for the script
 *
 * @param  {String}  dir  The basepath to run the script on
 */
const run = async (dir = BASE_PATH) => {
  if (args.watch) {
    try {
      watcher.on('change', async (changed) => {
        let local = changed.replace(process.env.PWD, '');

        console.log(`${alerts.watching} Detected change on ${alerts.path(`.${local}`)}`);

        await walk(dir);

        await write(FILE, SPRITE, true);

        console.log(`${alerts.success} Svgs finished`);
      });

      console.log(`${alerts.watching} Svgs watching ${alerts.ext(GLOBS.map(g => g.replace(process.env.PWD, '')).join(', '))}`);
    } catch (err) {
      console.error(`${alerts.error} Svgs (run): ${err}`);
    }
  } else {
    await walk(dir);

    await write(FILE, SPRITE.toString(), true);

    console.log(`${alerts.success} Svgs finished`);

    process.exit();
  }
};

/** @type  {Object}  Export our methods */
module.exports = {
  main: main,
  run: run,
  config: config
};
