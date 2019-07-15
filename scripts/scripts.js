const shell = require('shelljs');
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  shell.exec('npx rollup  -c config/rollup.js -w');
} else {
  shell.exec('npx rollup -c config/rollup.js');
}