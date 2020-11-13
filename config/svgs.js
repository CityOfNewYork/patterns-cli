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
   * @param {String} source https://github.com/svg/svgo#what-it-can-do
   */
  svgo: {
    convertPathData: false,
    // cleanupAttrs: true,
    // removeDoctype: true,
    // removeXMLProcInst: true,
    // removeComments: true,
    // removeMetadata: true,
    // removeTitle: true,
    // removeDesc: true,
    // removeUselessDefs: true,
    // removeEditorsNSData: true,
    // removeEmptyAttrs: true,
    // removeHiddenElems: true,
    // removeEmptyText: true,
    // removeEmptyContainers: true,
    // removeViewBox: false,
    // cleanupEnableBackground: true,
    // convertStyleToAttrs: true,
    // convertColors: true,
    // convertTransform: true,
    // removeUnknownsAndDefaults: true,
    // removeNonInheritableGroupAttrs: true,
    // removeUselessStrokeAndFill: true,
    // removeUnusedNS: true,
    // cleanupIDs: true,
    // cleanupNumericValues: true,
    // moveElemsAttrsToGroup: true,
    // moveGroupAttrsToElems: true,
    // collapseGroups: true,
    // removeRasterImages: false,
    // mergePaths: true,
    // convertShapeToPath: true,
    // sortAttrs: true,
    // removeDimensions: true,
    // removeAttrs: {attrs: '(stroke|fill)'}
  },
  /**
   * Plugin options for svgstore
   *
   * @param {String} source https://github.com/svgstore/svgstore#options
   */
  svgstore: {
    /** Filename of the sprite. It will not use the prefix defined above. */
    file: 'svgs.svg'
  }
};