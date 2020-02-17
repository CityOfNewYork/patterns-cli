#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/postcss`);

/**
 * The single command for PostCSS to process a Sass Module
 *
 * @param   {Array}  files  The contents of config/sass.js
 */
const run = async (mod) => {
  let bundle = path.join(process.env.PWD, mod.outDir, mod.outFile);
  let css = fs.readFileSync(bundle);

  try {
    let result = await postcss(config.plugins)
      .process(css, {
        from: bundle,
        to: bundle
      });

    await fs.writeFileSync(bundle, result.css);

    console.log(`${alerts.styles} PostCSS processed ${alerts.path(mod.outDir + mod.outFile)}`);
  } catch (err) {
    console.log(`${alerts.error} ${err}`);
  }
}

/**
 * A batch process function for each Sass Module for PostCSS to run on
 *
 * @param   {Array}  files  The contents of config/sass.js
 */
const each = async (modules) => {
  let i = 0;

  try {
    for (i; i < modules.length; i++) {
      await run(modules[i]);
    }
  } catch (err) {
    console.log(`${alerts.error} ${err}`);
  }
};

/** @type  {Object}  Export our methods */
module.exports = {
  'run': run,
  'each': each
};
