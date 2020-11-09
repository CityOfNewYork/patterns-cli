/**
 * Dependencies
 */

import babel from '@rollup/plugin-babel';              // Transpile source code.
import noderesolve from '@rollup/plugin-node-resolve'; // Locate modules using the Node resolution algorithm, for using third party modules in node_modules.
import replace from '@rollup/plugin-replace';          // Replace content while bundling.

/**
 * Rollup Configuration
 *
 * @type {Object}
 */
const rollup = {
  sourcemap: 'inline',
  format: 'iife',
  strict: true,
  plugins: [
    babel.babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    noderesolve({
      browser: true,
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    replace({
      'process.env.NODE_ENV': "'production'"
    })
  ]
};

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
        file: `${process.env.PWD}/dist/scripts/default.js`,
        sourcemap: rollup.sourcemap,
        format: rollup.format,
        strict: rollup.strict
      }
    ],
    plugins: rollup.plugins,
    devModule: true
  }
];
