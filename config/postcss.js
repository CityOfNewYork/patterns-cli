/**
 * Dependencies
 */

const path = require('path');
const tailwindcss = require('tailwindcss'); // utility framework
const cssnano = require('cssnano');         // css optimization
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));

/**
 * Config
 */

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    tailwindcss(resolve('config/tailwind', false)),
    cssnano()
  ]
};
