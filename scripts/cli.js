#!/usr/bin/env node

let script = process.argv.splice(2, 1)[0];

if (script === undefined) {
  require(`./default.js`);
} else {
  require(`./${script}.js`);
}