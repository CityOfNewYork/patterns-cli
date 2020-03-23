/**
 * Dependencies
 */

const path = require('path');

const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));

const package = resolve('package.json');
const tokens = resolve('config/tokens');

/**
 * Config
 */

module.exports = {
  /** The source directory */
  src: 'src',
  /** The directory for the views (within the source) */
  views: 'views',
  /** The distribution folder for the views */
  dist: 'dist',
  /** A list of sub directories to ignore while walking the views directory */
  blacklist: [
    'partials',
    'layouts'
  ],
  /**
   * Options to pass to the marked package
   * @param {Source} url https://marked.js.org/#/USING_ADVANCED.md#options
   */
  marked: {
    gfm: true,
    headerIds: true,
    smartypants: true
  },
  /**
   * Options to pass to the JS Beautify package for formatting html
   * @param {Source} url https://github.com/beautify-web/js-beautify
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
   * @param {Source} url https://github.com/slm-lang/slm#user-content-control-code--
   */
  package: package,
  process: {
    env: {
      NODE_ENV: process.env.NODE_ENV
    }
  },
  tokens: tokens
};
