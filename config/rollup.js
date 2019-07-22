/**
 * Dependencies
 */

import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { eslint } from 'rollup-plugin-eslint';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';

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
 * Only use ESLint in Production scripts
 */
if (process.env.NODE_ENV === 'production') {
  plugins['eslint'] = eslint({
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module'
    }}
  );

  rollup.dist.unshift(plugins.eslint);
  rollup.local.unshift(plugins.eslint);
}

/**
 * Our list of modules we are exporting
 * @type {Array}
 */
const modules = [
  {
    input: `${process.env.PWD}/src/utilities/forms/forms.js`,
    plugins: rollup.dist,
    output: [
      {
        name: 'Forms',
        file: `${process.env.PWD}/dist/utilities/forms/forms.iffe.js`,
        format: 'iife',
        strict: rollup.strict
      },
      {
        name: 'Forms',
        file: `${process.env.PWD}/dist/utilities/forms/forms.common.js`,
        format: 'cjs',
        strict: rollup.strict
      }
    ]
  }
];

export default modules;
