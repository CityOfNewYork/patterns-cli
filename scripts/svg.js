const concurrently = require('concurrently');
const nodemon = require('nodemon');
const args = process.argv.slice(2);
const prefix = '[svg]';
const bin = `${process.env.PWD}/node_modules/.bin`;

if (args.includes('-w') || args.includes('--watch')) {
  nodemon('-e svg --watch ./src/svg -x pttrn svg');
} else {
  concurrently([
    `${bin}/svgo -f ./src/svg -o ./dist/svg --disable=convertPathData`,
    `${bin}/svgstore -o ./dist/icons.svg ./dist/svg/*.svg --inline`
  ], {
    prefix: prefix
  });
}