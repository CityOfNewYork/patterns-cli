const shell = require('shelljs');
const nodemon = require('nodemon');
const args = process.argv.slice(2);

// shell.config.silent = true;

if (args.includes('-w') || args.includes('--watch')) {
  nodemon('-e scss --watch src --ignore _variables.scss -x node scripts/styles.js');
} else {
  shell.exec('node scripts/variables.js');
  shell.exec('node scripts/sass.js');
  shell.exec('node scripts/postcss.js');
}