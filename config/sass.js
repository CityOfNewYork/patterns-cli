/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const package = resolve('package.json');

/**
 * Config
 */

const sass = {
  sourceMapEmbed: true,
  includePaths: [
    `${process.env.PWD}/src/`,
    `${process.env.PWD}/node_modules/nyco-patterns/src/`
  ]
};

/**
 * The global style script.
 * @type {Array}
 */
let modules = [
  {
    file: './src/scss/default.scss',
    outDir: './dist/styles/',
    outFile: 'default.css',
    sourceMapEmbed: sass.sourceMapEmbed,
    includePaths: sass.includePaths,
    devModule: true // This needs to be set if we want the module to be compiled during development
  }
];

/**
 * The framework specific Sass styles that should only be bundled in this package.
 * @type {Array}
 */
const nycoscss = [
  {
    file: './src/utilities/spinner/_spinner.scss',
    outDir: './dist/utilities/spinner/',
    outFile: 'spinner.css',
    sourceMapEmbed: sass.sourceMapEmbed,
    includePaths: sass.includePaths,
    devModule: true
  }
];

/**
 * If the __dirname contains the package name then it is likely
 * installed in another project. Omit the Patterns Framework Sass
 * bundles.
 */
if (!__dirname.includes(package.name)) {
  modules = modules.concat(nycoscss);
}

module.exports = modules;
