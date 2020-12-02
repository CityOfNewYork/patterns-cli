/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const global = resolve('config/global');

/**
 * Config
 *
 * @type {Object}
 */
module.exports = {
  src: `${global.src}/svg`,   // svg source
  dist: `${global.dist}/svg`, // svg distribution
  prefix: 'pttrn-',           // Prefix to prepend to optimized svgs

  /**
   * Plugin options for SVGO
   *
   * @source https://github.com/svg/svgo#what-it-can-do
   */
  svgo: {
    convertPathData: false,
  },

  /**
   * Plugin options for svgstore
   *
   * @source https://github.com/svgstore/svgstore#options
   */
  svgstore: {
    /** Filename of the sprite. It will not use the prefix defined above. */
    file: 'svgs.svg'
  }
};