/**
 * Dependencies
 */

const noderesolve = require('@rollup/plugin-node-resolve'); // Locate modules using the Node resolution algorithm, for using third party modules in node_modules.
const babel = require('@rollup/plugin-babel');              // Transpile source code.
const replace = require('@rollup/plugin-replace');          // Replace content while bundling.

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const global = resolve('config/global');

/**
 * Plugin Configuration
 *
 * @type {Object}
 */
let plugins = {
  babel: babel.babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled'
  }),
  noderesolve: noderesolve({
    browser: true,
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  }),
  replace: replace({
    'process.env.NODE_ENV': "'production'"
  })
};

let dev = [
  plugins.babel,
  plugins.noderesolve
];

let prod = [
  plugins.babel,
  plugins.noderesolve,
  plugins.replace
];

/**
 * Rollup Exports
 *
 * @type {Array}
 */
module.exports = [
  {
    input: path.join(global.src, global.entry.scripts),
    output: [{
      file: path.join(global.dist, global.entry.scripts),
      name: global.entry.name,
      sourcemap: 'inline',
      format: 'iife',
      strict: true
    }],
    plugins: (process.env.NODE_ENV === 'production') ? prod : dev,
    devModule: true
  }
];
