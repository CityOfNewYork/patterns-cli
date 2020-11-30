#!/usr/bin/env node

let script = process.argv[2];

if (undefined === script || script[0] === '-') {
  process.argv.splice(2, 0, 'default');

  require(`${__dirname}/default`).run();
} else {
  require(`${__dirname}/${script}`).run();
}
