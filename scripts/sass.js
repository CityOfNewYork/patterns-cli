#!/usr/bin/env node

/**
 * Dependencies
 */

const sass = require('sass');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const alerts = require(`${process.env.PWD}/config/alerts`);

/**
 * The single command for Sass to process a Sass Module
 *
 * @param   {Array}  files  The contents of config/sass.js
 */
const run = async (mod) => {
  let outDir = path.join(process.env.PWD, mod.outDir);
  let name = mod.outFile;

  try {
    if (!fs.existsSync(outDir)) {
      await mkdirp(outDir);
    }

    let result = await sass.renderSync(mod);

    await fs.writeFileSync(`${outDir}${name}`, result.css);

    console.log(`${alerts.styles} Sass compiled to ${alerts.path(mod.outDir + name)}`);
  } catch (err) {
    let error = (err.formatted) ? err.formatted : err;
    console.log(`${alerts.error} Sass failed: ${error}`);
  }
}

/**
 * A batch process function for each Sass Module for Sass to run on
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
    console.log(`${alerts.error} Sass failed: ${err}`);
  }
};

/** @type  {Object}  Export our methods */
module.exports = {
  'run': run,
  'each': each
};
