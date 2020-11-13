/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const installed = require(path.join(__dirname, '../', 'bin/util/installed'));

/**
 * PostCSS Plugins
 *
 * @type {Array}
 */
let plugins = [
  require('cssnano')
];

/**
 * Check for tailwindcss
 */

if (installed('tailwindcss')) {
  const tailwindcss = require('tailwindcss');
  const config = resolve('config/tailwindcss', false);

  plugins.push(tailwindcss(config));
}

/**
 * PostCSS Configuration
 *
 * @type {Object}
 */
module.exports = {
  parser: 'postcss-scss',
  plugins: plugins
};
