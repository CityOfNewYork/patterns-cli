/**
 * Dependencies
 */

import babel from '@rollup/plugin-babel';              // Transpile source code.
import nodeResolve from '@rollup/plugin-node-resolve'; // Locate modules using the Node resolution algorithm, for using third party modules in node_modules.
import replace from '@rollup/plugin-replace';          // Replace content while bundling.

/**
 * Rollup Configuration
 *
 * @type {Object}
 */
const rollup = {
  sourcemap: 'inline',
  format: 'iife',
  strict: true
};

/**
 * Plugins Configuration
 *
 * @type {Object}
 */
let plugins = {
  babel: babel.babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled'
  }),
  nodeResolve: nodeResolve.nodeResolve({
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
  plugins.nodeResolve
];

let prod = [
  plugins.babel,
  plugins.nodeResolve,
  plugins.replace
];

/**
 * Rollup Export
 *
 * @type {Array}
 */
export default [
  {
    input: `${process.env.PWD}/src/js/default.js`,
    output: [
      {
        name: 'Default',
        file: `${process.env.PWD}/dist/js/default.js`,
        sourcemap: rollup.sourcemap,
        format: rollup.format,
        strict: rollup.strict
      }
    ],
    plugins: (process.env.NODE_ENV === 'production') ? prod : dev,
    devModule: true
  }
];
