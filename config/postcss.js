/**
 * Dependencies
 */

const tailwindcss = require('tailwindcss'); // utility framework/management
const autoprefixer = require('autoprefixer'); // adds vendor spec prefixes
const cssnano = require('cssnano'); // modern css compiling/minification
const mqpacker = require('css-mqpacker'); // packs media queries together

/**
 * Config
 */

const postCss = {
  parser: 'postcss-scss',
  plugins: [
    tailwindcss('./config/tailwind.js'),
    autoprefixer('last 4 version'),
    mqpacker({sort: true}),
    cssnano()
  ]
};

module.exports = postCss;
