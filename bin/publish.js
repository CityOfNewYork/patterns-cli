#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const ghpages = require('gh-pages');
const Path = require('path');

const resolve = require(`${__dirname}/util/resolve`);
const cnsl = require(`${__dirname}/util/console`);

const config = resolve('config/publish');
const alerts = resolve('config/alerts');
const global = resolve('config/global');

/**
 * Constants
 */

const dist = Path.join(global.base, global.dist);
const remote = (process.env.NODE_ENV === 'production')
  ? 'origin' : process.env.NODE_ENV;

/**
 * Functions
 */

const main = () => {
  if (undefined === remote) {
    cnsl.notify(`${alerts.info} Can't publish. Set ${alerts.str.ext('process.env.NODE_ENV')} to the desired remote defined in ${alerts.str.path('config/publish.js')}`);

    process.exit();
  }

  cnsl.describe(`${alerts.info} Publishing to ${remote}; ${config[process.env.NODE_ENV]}`);

  ghpages.publish(dist, {
    remote: remote,
    repo: config[process.env.NODE_ENV]
  }, err => {
    if (err) {
      cnsl.error(`Publish (main): ${err.stack}`);
    } else {
      cnsl.success('Published to GitHub Pages');
    }
  });
};

module.exports = {
  main: main,
  run: main
};