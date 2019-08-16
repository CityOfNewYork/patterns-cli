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
const repo = (process.env.NODE_ENV)
  ? process.env.NODE_ENV : 'production';
  
/**
 * Functions
 */

console.log(`${alerts.info} Publishing to ${remote}; ${config[repo]}`);

function fnCallback(err) {
  if (err) {
    console.log(`${alerts.error} ${err}`);
  }
  console.log(`${alerts.success} Published to GitHub Pages`);
}

ghpages.publish(dist, fnCallback);
