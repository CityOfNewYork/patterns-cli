#!/usr/bin/env node

/**
 * Dependencies
 */

const sass = (process.env.SASS === 'libSass') ? require('node-sass') : require('sass');
const path = require('path');
const fs = require('fs');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/sass`);

/** Get Modules */
const modules = config;

/** Process CLI args */
const cnsl = require(`${__dirname}/util/console`);

/**
 * The single command for Sass to process a Sass Module
 *
 * @param  {Array}  files  The contents of config/sass.js
 */
const main = async (style) => {
  let outDir = path.join(process.env.PWD, style.outDir);
  let name = style.outFile;

  try {
    if (!fs.existsSync(outDir)){
      fs.mkdirSync(outDir);
    }

    let result = sass.renderSync(style);

    fs.writeFileSync(`${outDir}${name}`, result.css);

    cnsl.describe(`${alerts.styles} Sass compiled to ${alerts.path(style.outDir + name)}`);
  } catch (err) {
    let error = (err.formatted) ? err.formatted : err.stack;
    cnsl.error(`Sass failed: ${error}`);
  }
}

/**
 * A batch process function for each Sass Module for Sass to run on
 *
 * @param  {Array}  files  The contents of config/sass.js
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

/** @type  {Object}  Export our methods */
module.exports = {
  main: main,
  run: run,
  config: config,
  modules: modules
};
