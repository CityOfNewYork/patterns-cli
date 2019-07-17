/**
 * Config
 */

const package = require('../package.json');
const version = process.env.V || package.version;

const variables = {
  'version': `"${version}"`,
  'cdn': `"https://cdn.jsdelivr.net/gh/CityOfNewYork/nyco-patterns-framework@v${version}/dist/"`
};

module.exports = variables;
