/**
 * Dependencies
 */

const ghpages = require('gh-pages');
const Path = require('path');
const config = require('../config/publish');
const alerts = require('../config/alerts');

/**
 * Constants
 */

const dist = Path.join(__dirname, '../', 'dist/');
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
    if (err) console.log(`${alerts.error} ${err}`);
    console.log(`${alerts.success} Published to GitHub Pages`);
  });
