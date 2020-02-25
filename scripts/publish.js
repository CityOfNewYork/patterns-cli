#!/usr/bin/env node

/**
 * Dependencies
 */

const ghpages = require('gh-pages');
const Path = require('path');
const config = require(`${process.env.PWD}/config/publish`);
const alerts = require(`${process.env.PWD}/config/alerts`);

/**
 * Constants
 */

const dist = Path.join(process.env.PWD, 'dist/');
const remote = (process.env.NODE_ENV === 'production')
  ? 'origin' : process.env.NODE_ENV;

/**
 * Functions
 */

console.log(`${alerts.info} Publishing to ${remote}; ${config[process.env.NODE_ENV]}`);

ghpages.publish(dist, {
  remote: remote,
  repo: config[process.env.NODE_ENV]
}, (err) => {
  if (err) console.log(`${prefix} ${alerts.error} ${err}`);
  console.log(`${prefix} ${alerts.success} Published to GitHub Pages`);
});