#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');

const resolve = require(`${__dirname}/util/resolve`);
const cnsl = require(`${__dirname}/util/console`);

const global = resolve('config/global');
const alerts = resolve('config/alerts');

/**
 *
 * @param {*} d
 */
const main = async (base, dir) => {
  let dirname = path.join(base, dir.__dirname);

  if (!fs.existsSync(dirname)) {
    await fs.mkdirSync(dirname, {
      recursive: true
    });

    cnsl.success(`${alerts.str.path(dirname)} was made.`);
  } else {
    cnsl.notify(`${alerts.str.path(dirname)} already exists.`);
  }

  if (dir.hasOwnProperty('files')) {
    for (let i = dir.files.length - 1; i >= 0; i--) {
      let pth = path.join(dirname, dir.files[i]);

      let templatePath = resolve(`config/scaffold/${dir.files[i]}`, false);
      let template = fs.readFileSync(templatePath, 'utf8');

      if (!fs.existsSync(pth.replace('.mjs', '.js'))) {
        await fs.writeFileSync(pth, template);

        cnsl.success(`${alerts.str.path(pth)} was made.`);
      } else {
        cnsl.notify(`${alerts.str.path(pth.replace('.mjs', '.js'))} already exists.`);
      }
    }
  } else if (!dir.hasOwnProperty('directories')) {
    await fs.writeFileSync(path.join(dirname, '.gitkeep'), '');
  }
};

/**
 *
 * @param {*} d
 */
const walk = async (base, dir) => {
  if (dir.hasOwnProperty('__dirname')) {
    await main(base, dir);
  }

  if (dir.hasOwnProperty('directories')) {
    try {
      base = path.join(base, ((dir.hasOwnProperty('__dirname')) ? dir.__dirname : ''));

      for (let i = dir.directories.length - 1; i >= 0; i--) {
        await walk(base, dir.directories[i]);
      }
    } catch (err) {
      cnsl.error(`Scaffold failed (walk): ${err.stack}`);
    }
  }
};

/**
 *
 */
const run = async () => {
  try {
    await walk(global.base, global);
  } catch (err) {
    cnsl.error(`Scaffold failed (run): ${err.stack}`);
  }
};

/**
 * Export our methods
 *
 * @type {Object}
 */
module.exports = {
  main: main,
  run: run
};
