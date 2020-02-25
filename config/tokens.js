/**
 * Config
 */

const package = require('../package.json');
const version = process.env.V || package.version;

const tokens = {
  /**
   * Possiple opts (and their defaults) to pass to json-to-scss
   * @param  {Source}  url  https://github.com/rlapoele/json-to-scss
   */
  opts: {
    output: '"./src/config/_tokens.scss"',
    prefix: '"$tokens:"',
    // suffix: ';',
    // format: '.scss',
    // indentationText: '  ',
    // indentationSize: 1,
    // emptyString: '""',
    // noUnderscore: true,
    // mergeSourceFiles: false,
    // mergeSassObjects: false,
    // keys: 'auto',
    // values: 'auto'
    // stringKeys: 'family,font-family,fontfamily,font-stack,fontstack,font-face,fontface'
  },
  animate: {
    'ease-in-quint': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
    'animate-scss-speed': '0.75s',
    'animate-timing-function': 'cubic-bezier(0.23, 1, 0.32, 1)'
  },
  version: `"${version}"`,
  cdn: `"https://cdn.jsdelivr.net/gh/CityOfNewYork/nyco-patterns-framework@v${version}/dist/"`
};

module.exports = tokens;
