#!/usr/bin/env node

/**
 * Dependencies
 */

const path = require('path');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/tokens`);
const jsJsonFilesToSassScssFiles = require('json-to-scss/lib/jsJsonFilesToSassScssFiles');

/** Set options for json-to-sass */
const opts = config.config;
const input = './config/tokens.js';
const output = opts.output.replace(/"/g, '');

const options = [
  {input: [path.join(process.env.PWD, input)]},
  {output: [path.join(process.env.PWD, output)]},
  {prefix: opts.prefix ? opts.prefix.replace(/"/g, '') : '$tokens:'},
  {suffix: opts.suffix ? opts.suffix.replace(/"/g, '') : ';'},
  {format: opts.format ? opts.format.replace(/"/g, '') : '.scss'},
  {indentationText: opts.indentationSize ? opts.indentationSize.replace(/"/g, '') : '  '},
  {indentationSize: opts.indentationSize ? opts.indentationSize.replace(/"/g, '') : 1},
  {emptyString: opts.emptyString ? opts.emptyString.replace(/"/g, '') : '""'},
  {noUnderscore: opts.noUnderscore ? opts.noUnderscore : true},
  {mergeSourceFiles: opts.mergeSourceFiles ? opts.mergeSourceFiles : false},
  {mergeSassObjects: opts.mergeSassObjects ? opts.mergeSassObjects : false},
  {keys: opts.keys ? opts.keys.replace(/"/g, '') : 'auto'},
  {values: opts.values ? opts.values.replace(/"/g, '') : 'auto'},
  {stringKeys: opts.stringKeys ? opts.stringKeys.replace(/"/g, '') : 'family,font-family,fontfamily,font-stack,fontstack,font-face,fontface'}
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

    console.log(`${alerts.scripts} Created ${alerts.path(output)} from ${alerts.path(input)}`);
  } catch (err) {
    console.log(`${alerts.error} Tokens failed: ${err}`);

    process.exit(1);
  }
};

/** @type  {Object}  Export our method */
module.exports = {
  'main': main,
  'run': main,
  'input': input,
  'config': config,
  'options': options
};
