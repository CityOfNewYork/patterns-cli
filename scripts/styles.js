const concurrently = require('concurrently');
const nodemon = require('nodemon');
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  nodemon('-e scss --watch src --ignore _variables.scss -x pttrn styles');
} else {
  concurrently([
    'pttrn variables',
    'pttrn sass',
    'pttrn postcss'
  ]);
}