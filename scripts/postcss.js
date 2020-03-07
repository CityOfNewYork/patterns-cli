#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/postcss`);

/** Get Modules */
const modules = require(`${process.env.PWD}/config/sass`);

/**
 * The single command for PostCSS to process a Sass Module
 *
 * @param  {Array}  files  The contents of config/sass.js
 */
const main = async (style) => {
  let bundle = path.join(process.env.PWD, style.outDir, style.outFile);
  let css = fs.readFileSync(bundle);

  try {
    let result = await postcss(config.plugins)
      .process(css, {
        from: bundle,
        to: bundle
      });

    fs.writeFileSync(result.opts.to, result.css);

    console.log(`${alerts.styles} PostCSS processed ${alerts.path(style.outDir + style.outFile)}`);
  } catch (err) {
    console.log(`${alerts.error} ${err}`);
  }
}

/**
 * A batch process function for each Sass Module for PostCSS to run on
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
    console.log(`${alerts.error} ${err}`);
  }
};

/** @type  {Object}  Export our methods */
module.exports = {
  'main': main,
  'run': run,
  'config': config,
  'modules': modules
};
