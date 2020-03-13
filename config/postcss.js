/**
 * Dependencies
 */

const package = require(`${process.env.PWD}/package.json`);
const tailwindcss = require('tailwindcss');                 // utility framework/management
const cssnano = require('cssnano');                         // modern css compiling/minification

/**
 * Config
 */

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    tailwindcss(`${process.env.PWD}/config/tailwind.js`),
    cssnano()
  ]
};
