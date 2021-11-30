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
  /**
   * Prefix to prepend to optimized svgs
   *
   * @type {String}
   */
  prefix: 'pttrn-',

  /**
   * Plugin options for SVGO
   *
   * @source https://github.com/svg/svgo#built-in-plugins
   */
   svgo: {
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
  },

  /**
   * Plugin options for svgstore
   *
   * @source https://github.com/svgstore/svgstore#options
   */
  svgstore: {
    /** Filename of the sprite. It will not use the prefix defined above. */
    file: 'svg/svgs.svg'
  }
};