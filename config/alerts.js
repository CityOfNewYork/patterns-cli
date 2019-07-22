let emoji = require('node-emoji');
let chalk = require('chalk');

module.exports = {
  styles: emoji.get('nail_care') + ' ',
  scripts: emoji.get('atom_symbol') + ' ',
  rollup: emoji.get('rolled_up_newspaper') + ' ',
  question: emoji.get('question') + ' ',
  attention: emoji.get('wave') + ' ',
  info: emoji.get('nerd_face') + ' ',
  error: emoji.get('octagonal_sign') + ' ',
  success: emoji.get('sparkles') + ' ',
  watching: emoji.get('eyes') + ' ',
  compression: emoji.get('compression') + ' ',
  package: emoji.get('package') + ' ',
  path: (str) => chalk.hex('#f2695d').underline(str),
  url: (str) => chalk.hex('#ebbcd8').underline(str),
  ext: (str) => chalk.hex('#3155a6').underline(str)
};