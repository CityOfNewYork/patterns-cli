#!/usr/bin/env node

let script = process.argv.splice(2, 1)[0];
let modules = [
  'styles', 'tokens', 'sass', 'postcss', 'slm', 'serve', 'svgs', 'rollup', 'publish', 'lint'
];

if (undefined === script) {
  require(`./default.js`);
} else {
  if (modules.includes(script)) {
    require(`${__dirname}/${script}`).run();
  } else {
    require(`${__dirname}/${script}`);
  }
}