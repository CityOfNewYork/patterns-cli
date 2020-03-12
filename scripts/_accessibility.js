#!/usr/bin/env node

/**
 * Dependencies
 */

const pa11y = require('pa11y');

/**
 * Constants
 */

/**
 * Functions
 */

pa11y(`./dist/*`).then((results) => {
  console.log(results);
});