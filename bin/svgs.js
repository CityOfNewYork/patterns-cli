#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { optimize } = require('svgo/lib/svgo');
const svgstore = require('svgstore');

const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);

const alerts = resolve('config/alerts');

/**
 * Get modules and configuration options
 *
 * @return  {Object}  Object containing initial modules and settings
 */
const options = () => {
  let config = resolve('config/svgs', true, false);

  return {
    modules: config.map(m => {
      m.ext = '.svg';

      return m;
    }),
    globs: [
      resolve('config/svgs', false)
    ]
  }
};

/**
 * Write the svg file to the distribution folder
 *
 * @param  {Object}  mod  The svg module to write
 */
const write = async mod => {
  try {
    let dist = path.join(mod.dist, mod.file);

    if (!fs.existsSync(path.dirname(dist))) {
      fs.mkdirSync(path.dirname(dist), {recursive: true});
    }

    if (mod.hasOwnProperty('store')) {
      await fs.writeFileSync(dist, mod.store.data);

      cnsl.describe(`${alerts.package} Svgs sprite written to ${alerts.str.path(dist)}`);
    } else {
      await fs.writeFileSync(dist, mod.optimized.data);

      cnsl.describe(`${alerts.compression} Svgs in ${alerts.str.path(mod.svg)} out ${alerts.str.path(dist)}`);
    }

    return mod;
  } catch (err) {
    cnsl.error(`Svgs (write): ${err.stack}`);
  }
}

/**
 * Create a global store
 *
 * @type {Object}
 */
let SPRITE = new svgstore();

/**
 * Add a file and it's data to the store
 *
 * @param  {Object}  mod  The svg module to write
 *
 * @return {Object}        The svg sprite
 */
const store = async mod => {
  try {
    SPRITE.add(mod.name, mod.optimized.data);

    return SPRITE;
  } catch (err) {
    cnsl.error(`Svgs failed (store): ${err.stack}`);
  }
};

/**
 * Optimize an svg by it's filename
 *
 * @param  {String}  file  The filename of the svg
 *
 * @return {String}        The optimized svg file contents
 */
const svgo = async mod => {
  try {
    let data = fs.readFileSync(mod.svg, 'utf-8');

    let optimized = await optimize(data, {
      path: mod.svg,
      ...mod.svgo
    });

    return optimized;
  } catch (err) {
    cnsl.error(`Svgs failed (svgo): ${err.stack}`);
  }
};

/**
 * The main function for the svg script
 *
 * @param  {Object}  mod  The svg module to write
 *
 * @return {Object}       The svg module to write
 */
const main = async mod => {
  try {
    // If the module has a restricted list, check to see if the file is permitted.
    if (mod.hasOwnProperty('restrict') && !mod.restrict.find(n => path.basename(mod.svg).includes(n))) {
      return mod;
    }

    mod.file = `${mod.prefix}${path.basename(mod.svg)}`;

    mod.name = path.basename(mod.file, path.extname(mod.file));

    mod.optimized = await svgo(mod);

    await store(mod);

    // Do not write the individual optimized svg if mod.write.source is false
    if (mod.hasOwnProperty('write') && mod.write.source === false)
      return mod;

    await write(mod);

    return mod;
  } catch (err) {
    cnsl.error(`Svgs failed (main): ${err.stack}`);
  }
};

/**
 * Read a specific file or if it's a directory, read all of the files in it
 *
 * @param  {Object}  mod  The svg module to write
 */
const walk = async mod => {
  if (mod.hasOwnProperty('svg')) {
    await main(mod);
  } else {
    try {
      let files = fs.readdirSync(mod.source, 'utf-8');

      for (let i = files.length - 1; i >= 0; i--) {
        let copy = Object.assign({}, mod);
        let source = path.join(mod.source, files[i]);

        if (path.basename(source).includes(mod.ext)) {
          copy.svg = source;
        } else if (fs.lstatSync(source).isDirectory()) {
          copy.source = source;
        } else {
          continue;
        }

        await walk(copy);
      }
    } catch (err) {
      cnsl.error(`Svgs failed (walk): ${err.stack}`);
    }
  }
};

/**
 * Runner for the script
 *
 * @param  {String}  dir  The base path to run the script on
 */
const run = async () => {
  let opts = options();

  if (args.watch) {
    try {
      for (let index = 0; index < opts.modules.length; index++) {
        const mod = opts.modules[index];

        if (!fs.existsSync(mod.source)) continue;

        const watcher = chokidar.watch([
          path.join(mod.source, `/**/*${mod.ext}`),
          ...opts.globs
        ], {
          usePolling: false,
          awaitWriteFinish: {
            stabilityThreshold: 750
          }
        });

        watcher.on('change', async changed => {
          cnsl.watching(`Detected change on ${alerts.str.path(changed)}`);

          SPRITE = (mod.hasOwnProperty('svgstore')) ?
            new svgstore(mod.svgstore) : new svgstore();

          await walk(mod);

          mod.store = {
            data: SPRITE.toString()
          };

          await write(mod);

          cnsl.success(`Svgs finished`);
        });

        cnsl.watching(`Svgs watching ${alerts.str.ext(opts.globs.join(', '))}`);
      }
    } catch (err) {
      console.error(`${alerts.error} Svgs (run): ${err}`);
    }
  } else {
    for (let index = 0; index < opts.modules.length; index++) {
      const mod = opts.modules[index];

      if (!fs.existsSync(mod.source)) process.exit();

      SPRITE = (mod.hasOwnProperty('svgstore')) ?
        new svgstore(mod.svgstore) : new svgstore();

      await walk(mod);

      mod.store = {
        data: SPRITE.toString()
      };

      await write(mod);
    }

    cnsl.success(`Svgs finished`);

    process.exit();
  }
};

/**
 * Export our methods
 *
 * @type {Object}
 */
module.exports = {
  main: main,
  run: run
};
