const concurrently = require('concurrently');
const args = process.argv.slice(2);
const prefix = '[scripts]';

if (args.includes('-w') || args.includes('--watch')) {
  concurrently([
    'node_modules/.bin/rollup -c config/rollup.js -w'
  ], {
    prefix: prefix
  });
} else {
  concurrently([
    'node_modules/.bin/rollup -c config/rollup.js'
  ], {
    prefix: prefix
  });
}