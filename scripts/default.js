const concurrently = require('concurrently');
const nodemon = require('nodemon');
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  nodemon('-e scss,js,svg,slm,md --watch src -x node scripts/default.js --ignore _variables.scss');
} else {
  concurrently([
    'node scripts/svgs.js',
    'node scripts/styles.js',
    'node scripts/scripts.js',
    'node scripts/build.js'
  ], {
    prefix: 'none'
  });
}