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

const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);

const alerts = resolve('config/alerts');
const config = resolve('config/svgs');

const plugins = {
  plugins: Object.keys(config.svgo).map((p) => {p: config.svgo[p]})
};

/**
 * Constants
 */

const SOURCE = path.join(process.env.PWD, config.src);
const DIST = path.join(process.env.PWD, config.dist);
const BASE_PATH = `${SOURCE}/${config.svgs}`;
const FILE = path.join(process.env.PWD, config.dist, config.svgs, config.svgstore.file);

const EXT = '.svg';
const GLOBS = [
  `${BASE_PATH}/**/*${EXT}`
];

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
    let dist = file.replace(BASE_PATH, path.join(DIST, config.svgs));
    let src = file.replace(process.env.PWD, '.');
    let local = dist.replace(process.env.PWD, '.');

    let message = (store) ?
      `${alerts.package} Svgs sprite written to ${alerts.str.path(local)}` :
      `${alerts.compression} Svgs in ${alerts.str.path(src)} out ${alerts.str.path(local)}`

    if (!fs.existsSync(path.dirname(dist))){
      fs.mkdirSync(path.dirname(dist));
    }

    fs.writeFileSync(dist, data);

    cnsl.describe(message);
  } catch (err) {
    cnsl.error(`Svgs (write): ${err.stack}`);
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

    SPRITE.add(`${config.svgstore.prefix}${name}`, data);

    return SPRITE;
  } catch (err) {
    cnsl.error(`Svgs failed (store): ${err.stack}`);
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
    cnsl.error(`Svgs failed (optimize): ${err.stack}`);
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
    cnsl.error(`Svgs failed (main): ${err.stack}`);
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
      cnsl.error(`Svgs failed (walk): ${err.stack}`);
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

        cnsl.watching(`Detected change on ${alerts.str.path(`.${local}`)}`);

        SPRITE = new svgstore();

        await walk(dir);

        await write(FILE, SPRITE, true);

        cnsl.success(`Svgs finished`);
      });

      cnsl.watching(`Svgs watching ${alerts.str.ext(GLOBS.map(g => g.replace(process.env.PWD, '.')).join(', '))}`);
    } catch (err) {
      console.error(`${alerts.error} Svgs (run): ${err}`);
    }
  } else {
    SPRITE = new svgstore();

    await walk(dir);

    await write(FILE, SPRITE.toString(), true);

    cnsl.success(`Svgs finished`);

    process.exit();
  }
};

/** @type {Object} Export our methods */
module.exports = {
  main: main,
  run: run,
  config: config
};
