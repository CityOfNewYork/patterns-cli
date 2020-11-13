#!/usr/bin/env node

/**
 * Dependencies
 */

const path = require('path');
const chokidar = require('chokidar');

const tokens = require(`${__dirname}/tokens`);
const sass = require(`${__dirname}/sass`);
const postcss = require(`${__dirname}/postcss`);
const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);

const alerts = resolve('config/alerts');

const SOURCE = path.join(process.env.PWD, 'src');
const EXT = '.scss';

const TOKENS_INPUT = tokens.options().input;
const TAILWINDCSS_INPUT = tokens.options().tailwindcss;

const globs = [
  `${SOURCE}/**/*${EXT}`,
  TOKENS_INPUT,
  TAILWINDCSS_INPUT
];

/**
 * Get Pattern Stylesheet Modules
 */

let modules = resolve('config/sass');

if (process.env.NODE_ENV === 'development') {
  modules = modules.filter(file => file.devModule);
}

/**
 * Methods
 */

/**
 * Run each task on the modules
 *
 * @param  {Array}  modules  The contents of config/sass.js
 */
const main = async (modules) => {
  try {
    await tokens.run();

    await sass.run(modules);

    await postcss.run(modules);
  } catch (err) {
    cnsl.error(`Styles failed: ${err.stack}`);
  }
};

/**
 * Our Chokidar Watcher
 *
 * @type {Source} https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(globs, {
  ignored: path.join(process.env.PWD, tokens.options().output.replace(/"/g, '')),
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
      watcher.on('change', changed => {
        let styls = [];

        cnsl.watching(`Detected change on ${alerts.str.path(changed)}`);

        if (process.env.NODE_ENV !== 'development') {
          let filtered = styles.filter(s => path.basename(changed) === path.basename(s.file));

          styls = (filtered.length) ? filtered : styles;
        } else {
          styls = styles;
        }

        main(styls);
      });

      cnsl.watching(`Styles watching ${alerts.str.ext(globs.join(', '))}`);
    } else {
      await main(modules);

      cnsl.success(`Styles finished`);

      process.exit();
    }
  } catch (err) {
    cnsl.error(`Styles failed: ${err.stack}`);
  }
};

/** @type  {Object}  Export our method */
module.exports = {
  globs: globs,
  main: main,
  run: run
};
