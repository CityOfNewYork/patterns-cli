const shell = require('shelljs');
const nodemon = require('nodemon');
const args = process.argv.slice(2);

if (args.includes('-w') || args.includes('--watch')) {
  nodemon('-e svg --watch ./src/svg -x pttrn svg');
} else {
  shell.exec('npx svgo -f ./src/svg -o ./dist/svg --disable=convertPathData');
  shell.exec('npx svgstore -o ./dist/icons.svg ./dist/svg/*.svg --inline');
}