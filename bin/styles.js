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
const global = resolve('config/global');

/**
 * Get Sass modules and options
 *
 * @return  {Options}  The configuration required for the styles command
 */
const options = () => {
  let modules = resolve('config/sass', true, false);

  if (process.env.NODE_ENV === 'development') {
    modules = modules.filter(file => file.devModule);
  }

  return {
    modules: modules,
    globs: [
      resolve('config/tokens', false),
      resolve('config/tailwindcss', false),
      resolve('config/sass', false),
      resolve('config/postcss', false),
      path.join(global.base, global.src, '/**/*.scss')
    ]
  }
};

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
 * @type  {Source}  https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(options().globs, {
  ignored: tokens.options().output.replace(/"/g, ''),
  ...global.chokidar
});

/**
 * Tne runner for single commands and the watcher
 */
const run = async () => {
  let opts = options();

  try {
    if (args.watch) {
      watcher.on('change', changed => {
        let styls = [];

        opts = options();

        cnsl.watching(`Detected change on ${alerts.str.path(changed)}`);

        opts.modules = opts.modules;

        // Only run main on changed modules by default
        if (process.env.NODE_ENV === 'production') {
          styls = opts.modules;
        } else {
          let filtered = opts.modules.filter(s => path.basename(changed) === path.basename(s.file));

          styls = (filtered.length) ? filtered : opts.modules;
        }

        main(styls);
      });

      cnsl.watching(`Styles watching ${alerts.str.ext(options().globs.join(', '))}`);
    } else {
      await main(options().modules);

      cnsl.success(`Styles finished`);

      process.exit();
    }
  } catch (err) {
    cnsl.error(`Styles failed: ${err.stack}`);
  }
};

/** @type  {Object}  Export our method */
module.exports = {
  globs: options().globs,
  main: main,
  run: run
};
