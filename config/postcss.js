/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const installed = require(path.join(__dirname, '../', 'bin/util/installed'));

/**
 * PostCSS plugins. This is where most of the configuration for PostCSS is
 * handled. Refer to the PostCSS docs for details and available plugins.
 *
 * @source https://github.com/postcss/postcss#plugins
 *
 * @type {Array}
 */
let plugins = [
  require('cssnano')
];

/**
 * Check for the tailwindcss package
 */

if (installed('tailwindcss')) {
  const tailwindcss = require('tailwindcss');
  const config = resolve('config/tailwindcss', false);

  plugins.push(tailwindcss(config));
}

/**
 * PostCSS configuration.
 *
 * @type {Object}
 */
module.exports = {
  parser: 'postcss-scss',
  plugins: plugins
};
