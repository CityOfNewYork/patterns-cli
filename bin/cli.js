#!/usr/bin/env node

let script = process.argv.splice(2, 1)[0];

if (undefined === script) {
  require(`${__dirname}/default.js`).run();
} else {
  require(`${__dirname}/${script}`).run();
}