#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const Path = require('path');
const Readline = require('readline');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/make`);

/**
 * Constants
 */

const TYPE = (process.argv[2] === 'utility') ? 'utilities' : `${process.argv[2]}s`;
const PATTERN = process.argv[3];
const FILE = process.argv[4];
const FILENAMES = Object.keys(config.files)
  .filter(f => config.optional.indexOf(f) === -1);

let prompt = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

/**
 * Functions
 */

/**
 * Parse variables in the config/make.js template strings.
 */
const parseVariables = (str) => str
  .split('{{ type }}').join(TYPE)
  .split('{{ prefix }}').join(config.prefixes[TYPE])
  .split('{{ pattern }}').join(PATTERN)
  .split('{{ Pattern }}').join(
    PATTERN
      .split('-').join(' ')
      .split('_').join(' ')
      .charAt(0).toUpperCase() + PATTERN.slice(1)
  );

/**
 * Evaluate a yes answer
 */
const yes = str => str.indexOf('y') === 0;

/**
 * An async forEach function
 */
const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}

/**
 * Log a message from MSG.
 */
const logInfo = (type) => (config.messages[type]) ?
  console.log(parseVariables(config.messages[type].join(''))) : false;

/**
 * Create the directory for the pattern if it doesn't exist
 * @param  {string}   dir      The directory to write
 * @param  {string}   type     The pattern type: elements, components, objects
 * @param  {string}   pattern  The name of the pattern
 * @param  {Function} callback They file writing function
 * @return {[type]}            false if directory exists
 */
function fnDirectory(dir, type, pattern, callback) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    callback(true);
  } else {
    callback(false);
  }
}

/**
 * Make the config file for the pattern if it doesn't exist
 * @param  {string} dir     The directory to write
 * @param  {string} type    The pattern type: elements, components, objects
 * @param  {string} pattern The name of the pattern
 * @return {boolean}        false if already exists, true if created
 */
function makeFile(dir, filetype, pattern, callback) {
  let file = parseVariables(config.files[filetype]);

  if (!fs.existsSync(`${dir}/${file}`)) {
    let content = parseVariables(config.templates[filetype]);

    fs.writeFile(`${dir}/${file}`, content, err => {
      if (err) {
        console.log(err);
        return false;
      }
    });

    callback(true, `${file}`);
  } else {
    callback(false, `${file}`);
  }
}

/**
 * Delegate to create the pattern directory, if it exists, log message
 * @param  {string}  dir     The directory to write
 * @param  {string}  pattern The name of the pattern
 * @return {boolean}         False if nothing is created
 */
function makeDefaults(type, pattern, callback) {
  let relative = Path.join(config.dirs.src, type);
  let absolute = Path.join(config.dirs.base, relative, pattern);

  fnDirectory(absolute, type, pattern, (success) => {
    if (success) {
      console.log(`${alerts.info} Creating source in ${relative}`);

      FILENAMES.forEach(filetype => {
        makeFile(absolute, filetype, pattern, (success, filename) => {
          if (success) {
            console.log(`${alerts.success} Created "${filename}".`);
            logInfo(filetype);
          }
        });
      });

      callback();
    } else {
      console.log(`${alerts.error} "${pattern}" already exists in ${relative}`);
      callback();
    }
  });
}

/**
 * Ask if we want to make the 'config' file.
 * @param  {string} dir     The directory to write
 * @param  {string} type    The pattern type: elements, components, objects
 * @param  {string} pattern The name of the pattern
 * @param  {[type]} prompt  The Readline prompt to ask if you want to creat a config
 */
function makeOptional(filetype, pattern, prompt) {
  return new Promise(resolve => {
    let isPattern = config.patterns.indexOf(filetype) > -1;
    let path = (isPattern) ? config.paths.pattern : config.paths[filetype]; // use the patterns default path instead

    let relative = parseVariables(path);
    let absolute = Path.join(config.dirs.base, relative);

    prompt.question(
      `${alerts.question} Would you like to create a "${filetype}" file for "${pattern}"? (y/n)`,
      (answer) => {
        if (yes(answer))
          makeFile(absolute, filetype, pattern, (success, file) => {
            if (success) {
              console.log(`${alerts.success} ${file} was made in ${relative}`);
              logInfo(filetype);
            } else {
              console.log(`${alerts.error} ${file} already exists in ${relative}`);
            }
          });

        resolve();
      }
    );
  });
}

/**
 * Initialize
 */

if (FILE) {
  (async () => {
    await makeOptional(FILE, PATTERN, prompt);
    prompt.close();
  })();

  return;
}

// Make the standard files, then...
makeDefaults(TYPE, PATTERN, () => {
  // .. ask to make the option files
  (async () => {
    await asyncForEach(config.optional, async (type) => {
      await makeOptional(type, PATTERN, prompt);
    });

    prompt.close();
  })();
});