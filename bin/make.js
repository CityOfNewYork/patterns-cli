#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const Path = require('path');
const Readline = require('readline');

const resolve = require(`${__dirname}/util/resolve`);
const cnsl = require(`${__dirname}/util/console`);

const alerts = resolve('config/alerts');
const config = resolve('config/make');

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

/** Evaluate a yes answer */
const yes = str => str.indexOf('y') === 0;

/** An async forEach function */
const each = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}

/**
 * Log a message from the messages config. Parses variables in message.
 *
 * @param  {String}  type  The key of the message to write.
 */
const logInfo = (type) => (config.messages[type]) ?
  cnsl.describe(parseVariables(config.messages[type].join(''))) : false;

/**
 * Create the directory for the pattern if it doesn't exist.
 *
 * @param  {String}    dir       The directory to write.
 * @param  {String}    type      The pattern type: elements, components, objects
 * @param  {Function}  callback  They file writing function.
 */
const directory = (dir, type, callback) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});

    callback(true);
  } else {
    callback(false);
  }
};

/**
 * Make the file for the pattern if it doesn't exist.
 *
 * @param  {String}  dir      The directory to write.
 * @param  {String}  type     The pattern type: elements, components, objects.
 * @param  {String}  pattern  The name of the pattern.
 */
const write = async (dir, filetype, callback) => {
  let file = parseVariables(config.files[filetype]);

  if (!fs.existsSync(`${dir}/${file}`)) {
    let ext = config.files[filetype].split('.')[1];
    let templatePath = resolve(`config/make/${filetype}.${ext}`, false);
    let template = fs.readFileSync(templatePath, 'utf8');

    let content = parseVariables(template);

    fs.writeFile(`${dir}/${file}`, content, err => {
      if (err) {
        cnsl.error(`Make failed (write): ${err.stack}`);

        return false;
      }
    });

    callback(true, `${file}`);
  } else {
    callback(false, `${file}`);
  }
};

/**
 * Delegate to create the pattern directory, if it exists, log message.
 *
 * @param  {String}   type     The pattern type.
 * @param  {String}   dir      The directory to write.
 * @param  {String}   pattern  The name of the pattern.
 */
const defaults = (type, pattern, callback) => {
  let relative = Path.join(config.dirs.src, type);
  let absolute = Path.join(config.dirs.base, relative, pattern);

  directory(absolute, type, (success) => {
    if (success) {
      FILENAMES.forEach(filetype => {
        write(absolute, filetype, (success, filename) => {
          if (success) {
            cnsl.success(`Created ${alerts.str.path('./' + Path.join(relative, pattern, filename))}`);

            logInfo(filetype);
          }
        });
      });

      callback();
    } else {
      cnsl.error(`${alerts.str.path('./' + relative + '/' + pattern)} already exists.`);

      callback();
    }
  });
};

/**
 * Ask if we want to make the optional files.
 *
 * @param  {String}  filetype  The pattern type: elements, components, objects
 * @param  {String}  pattern   The name of the pattern
 * @param  {[type]}  prompt    The Readline prompt to ask if you want to creat a config
 */
const optional = (filetype, pattern, prompt) => {
  return new Promise(resolve => {
    let isPattern = config.patterns.indexOf(filetype) > -1;
    let path = (isPattern) ? config.paths.pattern : config.paths[filetype]; // use the patterns default path instead

    let relative = parseVariables(path);
    let absolute = Path.join(config.dirs.base, relative);

    prompt.question(
      `${alerts.question} Make a ${alerts.str.string(filetype)} file for ${alerts.str.string(pattern)}? y/n ↵ `,
      (answer) => {
        if (yes(answer))
          write(absolute, filetype, (success, file) => {
            if (success) {
              cnsl.success(`${alerts.str.path('./' + Path.join(relative, file))} was made.`);

              logInfo(filetype);
            } else {
              cnsl.error(`${alerts.str.path('./' + Path.join(relative, file))} already exists.`);
            }
          });

        resolve();
      }
    );
  });
};

/**
 * The main runner for the script
 */
const run = async () => {
  try {
    if (FILE) {
      (async () => {
        await optional(FILE, PATTERN, prompt);

        prompt.close();
      })();

      return;
    }

    // Make the standard files, then...
    defaults(TYPE, PATTERN, () => {
      // ... ask to make the option files
      (async () => {
        await each(config.optional, async (type) => {
          await optional(type, PATTERN, prompt);
        });

        prompt.close();
      })();
    });
  } catch (err) {
    cnsl.error(`Make failed (run): ${err.stack}`);
  }
};

/** @type  {Object}  Export our methods */
module.exports = {
  run: run,
  config: config
};
