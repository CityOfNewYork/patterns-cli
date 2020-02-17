#!/usr/bin/env node

const path = require('path');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/tokens`).opts;
const jsJsonFilesToSassScssFiles = require('json-to-scss/lib/jsJsonFilesToSassScssFiles');

const input = './config/tokens.js';
const output = config.output.replace(/"/g, '');

const options = [
  {input: [path.join(process.env.PWD, input)]},
  {output: [path.join(process.env.PWD, output)]},
  {prefix: config.prefix ? config.prefix : '$tokens:'},
  {suffix: config.suffix ? config.suffix : ';'},
  {format: config.format ? config.format : '.scss'},
  {indentationText: config.indentationSize ? config.indentationSize : '  '},
  {indentationSize: config.indentationSize ? config.indentationSize : 1},
  {emptyString: config.emptyString ? config.emptyString : '""'},
  {noUnderscore: config.noUnderscore ? config.noUnderscore : true},
  {mergeSourceFiles: config.mergeSourceFiles ? config.mergeSourceFiles : false},
  {mergeSassObjects: config.mergeSassObjects ? config.mergeSassObjects : false},
  {keys: config.keys ? config.keys : 'auto'},
  {values: config.values ? config.values : 'auto'},
  {stringKeys: config.stringKeys ? config.stringKeys : 'family,font-family,fontfamily,font-stack,fontstack,font-face,fontface'}
];

/**
 * The single command for json-to-sass to process our Tokens
 *
 * @param   {Array}  files  The contents of config/sass.js
 */
const run = async (opts = options) => {
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
}

/** @type  {Object}  Export our method */
module.exports = {
  'run': run,
  'input': input
};
