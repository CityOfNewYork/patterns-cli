/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const package = resolve('package.json');
const global = resolve('config/global');
const tokens = resolve('config/tokens');

/**
 * Config
 *
 * @type {Object}
 */
module.exports = {
  src: global.src,           // Base source directory for all possible slm files
  dist: global.dist,         // Distribution for slm files
  views: global.entry.views, // View directory within source directory ^

  /**
   * Options to pass to the marked package
   *
   * @type {Source} https://marked.js.org/#/USING_ADVANCED.md#options
   */
  marked: {
    gfm: true,
    headerIds: true,
    smartypants: true
  },

  /**
   * Options to pass to the JS Beautify package for formatting html
   *
   * @type {Source} https://github.com/beautify-web/js-beautify
   */
  beautify: {
    indent_size: 2,
    indent_char: ' ',
    preserve_newlines: false,
    indent_inner_html: false,
    inline: [],
    wrap_line_length: 0,
    indent_inner_html: false
  },

  /**
   * The following objects are locals passed to the slm view render and
   * are accessed via control codes. For example, in a .slm template;
   *
   * h1 - this.package.name
   *
   * will render
   *
   * <h1>@nycopportunity/patterns-framework</h1>
   *
   * NOTE Functions can also be passed to the slm view render.
   *
   * @type {Source} https://github.com/slm-lang/slm#user-content-control-code--
   */
  package: package,
  global: global,
  tokens: tokens,
  process: {
    env: {
      NODE_ENV: process.env.NODE_ENV
    }
  }
};
