let emoji = require('node-emoji');

module.exports = {
  styles: emoji.get('nail_care') + ' ',
  scripts: emoji.get('atom_symbol') + ' ',
  question: emoji.get('question') + ' ',
  attention: emoji.get('wave') + ' ',
  info: emoji.get('nerd_face') + ' ',
  error: emoji.get('octagonal_sign') + ' ',
  success: emoji.get('sparkles') + ' '
};