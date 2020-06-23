/**
 * Dependencies
 */

let emoji = require('node-emoji');
let chalk = require('chalk');

/**
 * Config
 */

module.exports = {
  /**
   * Node Emoji
   *
   * @param  {String}  Source  https://github.com/omnidan/node-emoji
   * @param  {String}  Dict    https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
   */
  styles: emoji.get('nail_care'),
  scripts: emoji.get('rainbow'),
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
  accessible: emoji.get('wheelchair'),
  /**
   * Chalk string coloring functions
   *
   * @param  {String}  Source  https://github.com/chalk/chalk
   * @param  {String}  Colors  https://nycopatterns.cityofnewyork.us/colors
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