#!/usr/bin/env node

/**
 * Dependencies
 */

const path = require('path');

const jsJsonFilesToSassScssFiles = require('json-to-scss/lib/jsJsonFilesToSassScssFiles');

const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);

const alerts = resolve('config/alerts');
const config = resolve('config/tokens');

/** Set options for json-to-sass */
const input = resolve('config/tokens', false);
const output = config.output.replace(/"/g, '');

const options = [
  {input: [input]},
  {output: [path.join(process.env.PWD, output)]},
  {prefix: config.prefix ? config.prefix.replace(/"/g, '') : '$tokens:'},
  {suffix: config.suffix ? config.suffix.replace(/"/g, '') : ';'},
  {format: config.format ? config.format.replace(/"/g, '') : '.scss'},
  {indentationText: config.indentationSize ? config.indentationSize.replace(/"/g, '') : '  '},
  {indentationSize: config.indentationSize ? config.indentationSize.replace(/"/g, '') : 1},
  {emptyString: config.emptyString ? config.emptyString.replace(/"/g, '') : '""'},
  {noUnderscore: config.noUnderscore ? config.noUnderscore : true},
  {mergeSourceFiles: config.mergeSourceFiles ? config.mergeSourceFiles : false},
  {mergeSassObjects: config.mergeSassObjects ? config.mergeSassObjects : false},
  {keys: config.keys ? config.keys.replace(/"/g, '') : 'auto'},
  {values: config.values ? config.values.replace(/"/g, '') : 'auto'},
  {stringKeys: config.stringKeys ? config.stringKeys.replace(/"/g, '') : 'family,font-family,fontfamily,font-stack,fontstack,font-face,fontface'}
];

/**
 * The single command for json-to-sass to process our Tokens
 *
 * @param   {Array}  files  The contents of config/sass.js
 */
const main = async (opts = options) => {
  try {
    let args = opts.map((obj) => Object.values(obj)[0]);

    // Silence the json-to-sass package logs
    let write = process.stdout.write;
    process.stdout.write = () => {};

    await jsJsonFilesToSassScssFiles(...args);

    // Re-enable logging
    process.stdout.write = write;

    cnsl.describe(`${alerts.scripts} Created ${alerts.str.path(output)} from ${alerts.str.path(input.replace(process.env.PWD, '.'))}`);
  } catch (err) {
    cnsl.error(`Tokens failed: ${err.stack}`);
  }
};

/** @type  {Object}  Export our method */
module.exports = {
  main: main,
  run: main,
  input: input,
  config: config,
  options: options
};
