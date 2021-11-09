#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');

const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);
const installed = require(`${__dirname}/util/installed`);
const lint = require(`${__dirname}/lint`);

const alerts = resolve('config/alerts');

const sass = (installed('node-sass')) ? require('node-sass') : require('sass');

/**
 * Retrieve modules from config
 */

const modules = resolve('config/sass', true, false);

/**
 * The single command for Sass to process a Sass Module
 *
 * @param  {Array}  files  The contents of config/sass.js
 */
const main = async (style) => {
  try {
    // let outDir = path.join(process.env.PWD, style.outDir);
    let name = style.outFile;

    /** Lint file */
    if (!args.nolint) await lint.main(style.file);

    if (!fs.existsSync(style.outDir)){
      fs.mkdirSync(style.outDir, {recursive: true});
    }

    let result = sass.renderSync(style);

    fs.writeFileSync(`${style.outDir}${name}`, result.css);

    cnsl.describe(`${alerts.styles} Sass in ${alerts.str.path(style.file)} out ` +
      `${alerts.str.path(style.outDir + name)}`);
  } catch (err) {
    let error = (err.formatted) ? err.formatted : err.stack;

    cnsl.error(`Sass failed: ${error}`);
  }
}

/**
 * A batch process function for each Sass Module for Sass to run on
 */
const run = async (styles = modules) => {
  let i = 0;

  try {
    for (i; i < styles.length; i++) {
      await main(styles[i]);
    }
  } catch (err) {
    cnsl.error(`Sass failed: ${err.stack}`);
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
  config: modules,
  modules: modules
};
