#!/usr/bin/env node

/**
 * Dependencies
 */

const Path = require('path');
const dirTree = require('directory-tree');

/**
 * Constants
 */

const SRC = 'src/';
const VIEWS = Path.join(process.env.PWD, 'src/views');
const WHITELIST = ['elements', 'components', 'objects'];

/**
 * Init
 */

let locals = {
  variables: require(`${process.env.PWD}/config/variables`),
  site: require(`${process.env.PWD}/config/slm`),
  views: VIEWS,
  env: {
    NODE_ENV: process.env.NODE_ENV
  },
  modules: []
};

for (let i = 0; i < WHITELIST.length; i++) {
  let path = Path.join(process.env.PWD, SRC, WHITELIST[i]);

  let namespace = {
    path: path,
    name: WHITELIST[i],
    children: dirTree(path)
  }

  locals.modules.push(namespace);
}

module.exports = locals;
