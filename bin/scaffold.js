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
 * Make a file based on a scaffold template.
 *
 * @param   {String}  dirname   The directory to make the file in
 * @param   {String}  filename  The filename, should match the template name
 */
const file = async (dirname, filename) => {
  let pth = path.join(dirname, filename);

  let templatePath = resolve(`config/scaffold/${filename}`, false);
  let template = fs.readFileSync(templatePath, 'utf8');

  if (!fs.existsSync(pth.replace('.mjs', '.js'))) {
    await fs.writeFileSync(pth, template);

    cnsl.success(`${alerts.str.path(pth)} was made.`);
  } else {
    cnsl.notify(`${alerts.str.path(pth.replace('.mjs', '.js'))} already exists.`);
  }
}

/**
 * The main functionality for the command. Either creates a directory or set
 * of files based on the list it is passed.
 *
 * @param   {String}  base  The base for the director that will be created
 * @param   {Object}  dir   A description of the directory that will be created
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
      file(dirname, dir.files[i]);
    }
  } else if (!dir.hasOwnProperty('directories')) {
    await fs.writeFileSync(path.join(dirname, '.gitkeep'), '');
  }
};

/**
 * Walks a symbolic directory described by the global.js configuration.
 *
 * @param   {String}  base  The base directory to start with
 * @param   {Object}  dir   The directory structure described by the global.js configuration
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
 * The main command runner
 */
const run = async () => {
  try {
    // Create a package.json file for the project
    file(global.base, 'package.json');

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
