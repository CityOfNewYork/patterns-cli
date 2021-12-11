/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const global = resolve('config/global');

/**
 * Plugin options for SVGO
 *
 * @source https://github.com/svg/svgo#built-in-plugins
 */
const svgo = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertPathData: false,
          inlineStyles: false,
          cleanupIDs: false
        }
      }
    }
  ]
};

/**
 * Plugin options for svgstore
 *
 * @source https://github.com/svgstore/svgstore#options
 */
const svgstore = {};

/**
 * Config
 *
 * @type {Object}
 */
module.exports = [
  {
    source: path.join(global.base, global.src, global.entry.svg),
    dist: path.join(global.base, global.dist, global.entry.svg),
    prefix: 'pttrn-',
    file: 'svgs.svg',
    svgo: svgo,
    svgstore: svgstore,
    // restrict: [],     // Limit the svgs that will be compiled from the source directory and included in the sprite.
    // write: {
    //   source: false   // Prevent writing of individual optimized svgs into the dist
    // }
  },
  // {
  //   ... additional modules...
  // }
];
