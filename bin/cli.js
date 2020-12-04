#!/usr/bin/env node

/**
 * Dependencies
 */

const resolve = require(`${__dirname}/util/resolve`);

/**
 * Args
 */

let script = process.argv[2];

/**
 * Main
 */

if (undefined === script || script[0] === '-') {
  process.argv.splice(2, 0, 'default');

  resolve('bin/default').run();
} else {
  try {
    resolve(`bin/${script}`).run();
  } catch (error) {
    console.log(`"${script}" is not a supported command.`);
  }
}
