#!/usr/bin/env node

let script = process.argv.splice(2, 1)[0];
let modules = [
  'styles',
  'tokens',
  'sass',
  'postcss',
  'slm',
  'serve'
];

if (script === undefined) {
  require(`./default.js`);
} else {
  if (modules.includes(script)) {
    require(`./${script}.js`).run();
  } else {
    require(`./${script}.js`);
  }
}