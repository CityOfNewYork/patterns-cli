const concurrently = require('concurrently');
const nodemon = require('nodemon');
const args = process.argv.slice(2);
const prefix = '[svg]';

if (args.includes('-w') || args.includes('--watch')) {
  nodemon('-e svg --watch ./src/svg -x pttrn svg');
} else {
  concurrently([
    'node_modules/.bin/svgo -f ./src/svg -o ./dist/svg --disable=convertPathData',
    'node_modules/.bin/svgstore -o ./dist/icons.svg ./dist/svg/*.svg --inline'
  ], {
    prefix: prefix
  });
}