const concurrently = require('concurrently');
const nodemon = require('nodemon');
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  nodemon('-e scss,js,svg,slm,md --watch src -x pttrn default --ignore _variables.scss');
} else {
  concurrently([
    'pttrn svg',
    'pttrn styles',
    'pttrn scripts',
    'pttrn build'
  ], {
    prefix: 'none'
  });
}