/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const package = resolve('package.json');

/**
 * Config
 */

module.exports = {
  /**
   * Possiple options (and their defaults) to pass to json-to-scss
   * @param {Source} url https://github.com/rlapoele/json-to-scss
   */
  output: '"./src/config/_tokens.scss"',
  // prefix: '"$tokens:"',
  // suffix: '"";""',
  // format: '".scss"',
  // indentationText: '"  ""',
  // indentationSize: 1,
  // emptyString: '""',
  // noUnderscore: true,
  // mergeSourceFiles: false,
  // mergeSassObjects: false,
  // keys: 'auto',
  // values: 'auto',
  // stringKeys: '"family,font-family,fontfamily,font-stack,fontstack,font-face,fontface"',
  animate: {
    'ease-in-quint': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
    'speed': '0.75s',
    'timing-function': 'cubic-bezier(0.23, 1, 0.32, 1)'
  },
  version: `"${package.version}"`
};
