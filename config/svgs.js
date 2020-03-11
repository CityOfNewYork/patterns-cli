/**
 * Dependencies
 */

/**
 * Config
 */

module.exports = {
  config: {
    /** The source directory */
    src: 'src',
    /** The directory for the views (within the source) */
    svgs: 'svg',
    /** The distribution folder for the views */
    dist: 'dist'
  },
  /**
   * Plugin options for SVGO
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
   * Plugin options for SVGO
   * @param {String} source https://github.com/svg/svgo#what-it-can-do
   */
  svgstore: {
    /** Prefix of the icon id. This will be prepended to the filename. */
    prefix: '',
    /** Filename of the sprite */
    file: 'icons.svg'
  }
}