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
  'production': package.repository.url
};