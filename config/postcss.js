/**
 * Dependencies
 */

const package = require(`${process.env.PWD}/package.json`);
const tailwindcss = require('tailwindcss'); // utility framework/management
const autoprefixer = require('autoprefixer'); // adds vendor spec prefixes
const cssnano = require('cssnano'); // modern css compiling/minification
const mqpacker = require('css-mqpacker'); // packs media queries together
const stylelint = require('stylelint');

/**
 * Config
 */

const PostCSS = {
  parser: 'postcss-scss',
  plugins: [
    stylelint(package.stylelintConfig),
    tailwindcss(`${process.env.PWD}/config/tailwind.js`),
    autoprefixer('last 4 version'),
    mqpacker({sort: true}),
    cssnano()
  ]
};

module.exports = PostCSS;
