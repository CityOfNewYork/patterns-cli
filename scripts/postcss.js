#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const alerts = require(`${process.env.PWD}/config/alerts`);

/** Config Getter */
const config = () => {
  return require(`${process.env.PWD}/config/postcss`);
};

/** Set options for PostCSS */
const options = config();

/** Get Modules */
const modules = require(`${process.env.PWD}/config/sass`);

/**
 * The single command for PostCSS to process a Sass Module
 *
 * @param   {Array}  files  The contents of config/sass.js
 */
const main = async (style) => {
  let bundle = path.join(process.env.PWD, style.outDir, style.outFile);
  let css = fs.readFileSync(bundle);

  try {
    let result = await postcss(options.plugins)
      .process(css, {
        from: bundle,
        to: bundle
      });

    await fs.writeFileSync(bundle, result.css);

    console.log(`${alerts.styles} PostCSS processed ${alerts.path(style.outDir + style.outFile)}`);
  } catch (err) {
    console.log(`${alerts.error} ${err}`);
  }
}

/**
 * A batch process function for each Sass Module for PostCSS to run on
 *
 * @param   {Array}  files  The contents of config/sass.js
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
  'options': options,
  'modules': modules
};
