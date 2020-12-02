#!/usr/bin/env node

let script = process.argv[2];

if (undefined === script || script[0] === '-') {
  process.argv.splice(2, 0, 'default');

  require(`${__dirname}/default`).run();
} else {
  try {
    require(`${__dirname}/${script}`).run();
  } catch (error) {
    console.log(`"${script}" is not a supported command.`);
  }
}
