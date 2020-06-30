/**
 * Dependencies
 */

const path = require('path');
const noderesolve = require('@rollup/plugin-node-resolve'); // Locate modules using the Node resolution algorithm, for using third party modules in node_modules.
const commonjs = require('@rollup/plugin-commonjs');        // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
const babel = require('rollup-plugin-babel');               // Transpile source code.
const buble = require('@rollup/plugin-buble');              // Convert ES2015 with buble.
const replace = require('@rollup/plugin-replace');          // Replace content while bundling.
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const package = resolve('package.json');

/**
 * Config
 */

/**
 * Plugin configuration
 * @type {Object}
 */
const plugins = {
  babel: babel({
    exclude: 'node_modules/**'
  }),
  noderesolve: noderesolve({
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
 * General configuration for Rollup
 * @type {Object}
 */
let rollup = {
  sourcemap: 'inline',
  format: 'iife',
  strict: true
};

/**
 * Distribution plugin settings. Order matters here.
 * @type {Array}
 */

/** These are plugins used for the global patterns script */
rollup.local = [
  plugins.alias,
  plugins.noderesolve,
  plugins.common,
  plugins.vue,
  plugins.buble,
  plugins.babel,
  plugins.replace
];

rollup.dist = [
  plugins.noderesolve,
  plugins.common,
  plugins.vue,
  plugins.buble,
  plugins.babel
];

/**
 * The global JS script.
 * @type {Array}
 */
let modules = [
  {
    input: './src/js/default.js',
    output: [
      {
        name: 'Default',
        file: './dist/scripts/default.js',
        sourcemap: rollup.sourcemap,
        format: rollup.format,
        strict: rollup.strict
      }
    ],
    plugins: rollup.plugins,
    devModule: true
  }
];

/**
 * The framework specific JS scripts that should only be bundled in this package.
 * @type {Array}
 */
const nycojs = [
  {
    input: './src/utilities/copy/copy.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'Forms',
        file: './dist/utilities/copy/copy.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/forms/forms.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'Forms',
        file: './dist/utilities/forms/forms.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/icons/icons.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'Icons',
        file: './dist/utilities/icons/icons.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/localize/localize.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'localize',
        file: './dist/utilities/localize/localize.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/lzw/lzw.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'LZW',
        file: './dist/utilities/lzw/lzw.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/spinner/spinner.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'Spinner',
        file: './dist/utilities/spinner/spinner.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/toggle/toggle.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'Toggle',
        file: './dist/utilities/toggle/toggle.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/tooltips/tooltips.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'Forms',
        file: './dist/utilities/tooltips/tooltips.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/track/track.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'Track',
        file: './dist/utilities/track/track.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
  {
    input: './src/utilities/web-share/web-share.js',
    plugins: rollup.dist,
    output: [
      {
        name: 'Forms',
        file: './dist/utilities/web-share/web-share.iffe.js',
        format: 'iife',
        strict: rollup.strict
      }
    ]
  },
];

/**
 * If the __dirname contains the package name then it is likely
 * installed in another project. Omit the NYCO JS bundles.
 */
if (!__dirname.includes(package.name)) {
  modules = modules.concat(nycojs);
}

module.exports = modules;
