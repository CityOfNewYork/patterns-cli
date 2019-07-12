/**
 * Dependencies
 */

const Path = require('path');
const dirTree = require('directory-tree');

/**
 * Constants
 */

const SRC = 'src/';
const VIEWS = Path.join(__dirname, '../', 'src/views');
const WHITELIST = ['elements', 'components', 'objects'];

/**
 * Init
 */

let locals = {
  vars: require('../config/variables'),
  site: require('../config/site'),
  views: VIEWS,
  modules: []
};

for (let i = 0; i < WHITELIST.length; i++) {
  let path = Path.join(__dirname, '../', SRC, WHITELIST[i]);
  let namespace = {
    path: path,
    name: WHITELIST[i],
    children: dirTree(path)
  }
  locals.modules.push(namespace);
}

module.exports = locals;
