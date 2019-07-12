const concurrently = require('concurrently');
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  concurrently(['node_modules/.bin/rollup -c config/rollup.js -w']);
} else {
  concurrently(['node_modules/.bin/rollup -c config/rollup.js']);
}