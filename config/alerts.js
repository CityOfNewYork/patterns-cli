/**
 * Dependencies
 */

let emoji = require('node-emoji');
let chalk = require('chalk');

/**
 * Alert configuration
 *
 * @type {Object}
 */
module.exports = {
  /**
   * Node Emoji. Refer to the package for details on the available options.
   *
   * @source https://github.com/omnidan/node-emoji
   * @source https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
   */
  styles: emoji.get('nail_care'),
  scripts: emoji.get('rainbow'),
  tokens: emoji.get('black_circle'),
  rollup: emoji.get('rolled_up_newspaper') + ' ',
  question: emoji.get('question'),
  attention: emoji.get('wave'),
  info: emoji.get('nerd_face'),
  error: emoji.get('octagonal_sign'),
  warning: emoji.get('warning'),
  success: emoji.get('sparkles'),
  watching: emoji.get('eyes'),
  compression: emoji.get('compression') + ' ',
  package: emoji.get('package'),
  accessible: emoji.get('person_doing_cartwheel'),

  /**
   * Chalk configuration. Refer to the package for details on the available
   * options. The current color selection is based on the NYC Opportunity
   * brand colors.
   *
   * @source https://github.com/chalk/chalk
   * @source https://nycopatterns.cityofnewyork.us/colors
   *
   * @type {Object}
   */
  str: {
    path: s => chalk.hex('#FFC0F6').underline(s), // pink
    url: s => chalk.hex('#284CCA').underline(s),  // blue
    ext: s => chalk.hex('#96BEFF').underline(s),  // lighter blue
    string: s => chalk.hex('#AED581')(s),         // green
    comment: s => chalk.hex('#7C7F83')(s),        // grey
    error: s => chalk.hex('#FC5D52')(s),          // red
    warning: s => chalk.hex('#FBB95A')(s)         // orange
  }
};