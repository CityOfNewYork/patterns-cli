/**
 * Dependencies
 */

const nodeResolve = require('@rollup/plugin-node-resolve'); // Locate modules using the Node resolution algorithm, for using third party modules in node_modules.
const replace = require('@rollup/plugin-replace');          // Replace content while bundling.

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const global = resolve('config/global');

/**
 * Plugin configuration. Refer to the package for details on the available options.
 *
 * @source https://github.com/rollup/plugins
 *
 * @type {Object}
 */
let plugins = [
  replace({
    'preventAssignment': true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  nodeResolve.nodeResolve({
    browser: true,
    moduleDirectories: [
      'node_modules'
    ]
  })
];

/**
 * ES Module Exports
 *
 * @type {Array}
 */
module.exports = [
  {
    input: path.join(global.base, global.src, global.entry.scripts),
    cache: true,
    output: [{
      file: path.join(global.base, global.dist, global.entry.scripts),
      name: global.entry.name,
      sourcemap: (process.env.NODE_ENV === 'production') ? false : 'inline',
      format: 'iife',
      strict: true
    }],
    plugins: plugins,
    devModule: true
  }
];
