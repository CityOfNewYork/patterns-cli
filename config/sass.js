/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const global = resolve('config/global');

/**
 * Sass Exports
 *
 * @type {Array}
 */
module.exports = [
  {
    file: path.join(global.base, global.src, global.entry.styles),
    outDir: path.join(global.dist, 'css') + '/',
    outFile: path.basename(global.entry.styles.replace('.scss', '.css')),
    sourceMapEmbed: true,
    includePaths: [
      `${global.base}/${global.src}/`,
      `${global.base}/node_modules/`
    ],
    devModule: true // This needs to be set if we want the module to be compiled during development
  }
];
