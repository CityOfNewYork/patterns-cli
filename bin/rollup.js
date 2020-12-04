#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const path = require('path');
const rollup = require('rollup');
const chokidar = require('chokidar');

const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);
const lint = require(`${__dirname}/lint`);

const alerts = resolve('config/alerts');
const global = resolve('config/global');

/**
 * Set options to a function for watching config changes
 *
 * @return  {Object}  Containing the script options
 */
const options = () => {
  let config = resolve('config/rollup', true, false);
  let source = path.join(global.base, global.src);
  let ext = '.js';

  let modules = config;

  /**
   * Development Mode
   */

  if (process.env.NODE_ENV === 'development') {
    modules = modules.filter(file => file.devModule);
  }

  return {
    config: resolve('config/rollup', true, false),
    source: source,
    ext: ext,
    globs: [
      resolve('config/rollup', false),
      `${source}/**/*${ext}`,
    ],
    modules: modules
  }
}

/**
 * Our Chokidar Watcher
 *
 * @type {Source} https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(options().globs, {
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

    for (let i = 0; i < script.output.length; i++) {
      await bundle.write(script.output[i]);

      cnsl.describe(`${alerts.rollup} Rollup in ${alerts.str.path(script.input)} out ` +
        `${alerts.str.path(script.output[i].file)}`);
    }
  } catch (err) {
    cnsl.error(`Rollup failed (main): ${err.stack}`);
  }
};

/**
 * Runner for the sample script
 */
const run = async () => {
  let opts = options();

  if (args.watch) {
    try {
      watcher.on('change', async changed => {
        let scrpts = [];

        cnsl.watching(`Detected change on ${alerts.str.path(changed)}`);

        if (process.env.NODE_ENV !== 'development') {
          let filtered = opts.modules.filter(s => path.basename(changed) === path.basename(s.input));

          scrpts = (filtered.length) ? filtered : opts.modules;
        } else {
          scrpts = opts.modules;
        }

        for (let i = 0; i < scrpts.length; i++) {
          await main(scrpts[i]);
        }
      });

      cnsl.watching(`Rollup watching ${alerts.str.ext(opts.globs.join(', '))}`);
    } catch (err) {
      console.error(`${alerts.error} Rollup (run): ${err.stack}`);
    }
  } else {
    for (let i = 0; i < opts.modules.length; i++) {
      await main(opts.modules[i]);
    }

    cnsl.success(`Rollup finished`);

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
  run: run,
  options: options
};
