/**
 * Dependencies
 */

import resolve from 'rollup-plugin-node-resolve'; // Locate modules using the Node resolution algorithm, for using third party modules in node_modules.
import commonjs from 'rollup-plugin-commonjs';    // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
import babel from 'rollup-plugin-babel';          // Transpile source code.
import buble from 'rollup-plugin-buble';          // Convert ES2015 with buble.
import replace from 'rollup-plugin-replace';      // Replace content while bundling.

/**
 * Config
 */

/**
 * General configuration for Rollup
 * @type {Object}
 */
let rollup = {
  sourcemap: 'inline',
  format: 'iife',
  strict: true
};

/**
 * Plugin configuration
 * @type {Object}
 */
const plugins = {
  babel: babel({
    exclude: 'node_modules/**'
  }),
  resolve: resolve({
    browser: true,
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  }),
  replace: replace({
    'process.env.NODE_ENV': "'production'"
  }),
  common: commonjs(),
  buble: buble({
    transforms: {
      forOf: false
    }
  })
};

/**
 * Distribution plugin settings. Order matters here.
 * @type {Array}
 */

/** These are plugins used for the global patterns script */
rollup.local = [
  plugins.alias,
  plugins.resolve,
  plugins.common,
  plugins.vue,
  plugins.buble,
  plugins.babel,
  plugins.replace
];

rollup.dist = [
  plugins.resolve,
  plugins.common,
  plugins.vue,
  plugins.buble,
  plugins.babel
];

/**
 * Our list of modules we are exporting
 * @type {Array}
 */
const modules = [
  {
    input: `${process.env.PWD}/src/js/main.js`,
    output: [
      {
        name: 'Patterns',
        file: `${process.env.PWD}/dist/scripts/patterns.js`,
        sourcemap: rollup.sourcemap,
        format: rollup.format,
        strict: rollup.strict
      }
    ],
    plugins: rollup.plugins
  },
  {
    input: `${process.env.PWD}/src/utilities/forms/forms.js`,
    plugins: rollup.dist,
    output: [
      {
        name: 'Forms',
        file: `${process.env.PWD}/dist/utilities/forms/forms.iffe.js`,
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: `${process.env.PWD}/src/utilities/icons/icons.js`,
    plugins: rollup.dist,
    output: [
      {
        name: 'Icons',
        file: `${process.env.PWD}/dist/utilities/icons/icons.iffe.js`,
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: `${process.env.PWD}/src/utilities/localize/localize.js`,
    plugins: rollup.dist,
    output: [
      {
        name: 'localize',
        file: `${process.env.PWD}/dist/utilities/localize/localize.iffe.js`,
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: `${process.env.PWD}/src/utilities/lzw/lzw.js`,
    plugins: rollup.dist,
    output: [
      {
        name: 'LZW',
        file: `${process.env.PWD}/dist/utilities/lzw/lzw.iffe.js`,
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: `${process.env.PWD}/src/utilities/spinner/spinner.js`,
    plugins: rollup.dist,
    output: [
      {
        name: 'Spinner',
        file: `${process.env.PWD}/dist/utilities/spinner/spinner.iffe.js`,
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: `${process.env.PWD}/src/utilities/toggle/toggle.js`,
    plugins: rollup.dist,
    output: [
      {
        name: 'Toggle',
        file: `${process.env.PWD}/dist/utilities/toggle/toggle.iffe.js`,
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: `${process.env.PWD}/src/utilities/track/track.js`,
    plugins: rollup.dist,
    output: [
      {
        name: 'Track',
        file: `${process.env.PWD}/dist/utilities/track/track.iffe.js`,
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
];

export default modules;
