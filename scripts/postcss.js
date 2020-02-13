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
 *
 * @return  {Boolean}       Wether process has completed or not
 */
const run = async (file) => {
  let bundle = path.join(process.env.PWD, file.outDir, file.outFile);

  let css = fs.readFileSync(bundle);
  let result = await postcss(config.plugins)
    .process(css, {
      from: bundle,
      to: bundle
    });

  try {
    await fs.writeFileSync(bundle, result.css);

    console.log(`${alerts.styles} PostCSS processed ${alerts.path(file.outDir + file.outFile)}`);
  } catch (err) {
    console.log(`${alerts.error} ${err}`);
  }
}

/**
 * A batch process function for each Sass Module for PostCSS to run on
 *
 * @param   {Array}  files  The contents of config/sass.js
 *
 * @return  {Boolean}       Wether process has completed or not
 */
const each = async (files) => {
  let i = 0;

  try {
    if (process.env.NODE_ENV === 'development') {
      for (i; i < files.length; i++) {
        if (files[i].devModule) {
          await run(files[i]);

          break;
        }
      }
    } else {
      for (i; i < files.length; i++) {
        await run(files[i]);
      }
    }

    return true;
  } catch (err) {
    console.log(`${alerts.error} ${err}`);

    return false;
  }
};

/** @type  {Object}  Export our methods */
module.exports = {
  'run': run,
  'each': each
};
