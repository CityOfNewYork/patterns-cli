/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const global = resolve('config/global');
const package = resolve('package.json');

/**
 * Tokens Export
 *
 * @type {Object}
 */
module.exports = {
  /**
   * Possiple options (and their defaults) to pass to json-to-scss
   *
   * @type {Source} https://github.com/rlapoele/json-to-scss
   */
  output: `"${global.src}/${global.entry.config}/_tokens.scss"`,
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
  'version': `"${package.version}"`,
  'border': {
    'width': '3px',
    'style': 'solid',
    'radius': '16px'
  },
  'color': {
    'white': '#FFF',
    'blue': '#284CCA',
    'red': '#FC5D52',
    'gray': '#E6E8EC'
  },
  'font-family': {
    'system': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', '"Helvetica Neue"', 'sans-serif'],
    'monospace': 'monospace'
  },
  'font': {
    'body': 'system',
    'pre': 'monospace'
  },
  'font-weight': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-style': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-size': {
    'body': '1em',
    'pre': '0.9em'
  },
  'line-height': {
    'body': '1.2',
    'pre': '1.5'
  },
  'grid': '8px', // 8px grid system
  'typography': {
    'small': '16px',
    'mobile': '18px',
    'tablet': '20px',
    'desktop': '22px'
  }
};
