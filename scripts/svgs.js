const shell = require('shelljs');
const nodemon = require('nodemon');
const args = process.argv.slice(2);
const alerts = require(`${process.env.PWD}/config/alerts`);

shell.config.silent = true;

if (args.includes('-w') || args.includes('--watch')) {
  nodemon(`-e svg --watch ./src/svg -x node ${__dirname}/svgs.js`);
  console.log(`${alerts.watching} Svgs watching ${alerts.ext('.svg')} in ${alerts.path('./src/svg')}`);
} else {
  let input = './src/svg';
  let output = './dist/svg';

  shell.exec(`npx svgo -f ${input} -o ${output} --disable=convertPathData`, (code, stdout, stderr) => {
    if (code) {
      console.log(`${alerts.error} "svgs" failed: ${stderr}`);
    } else {
      console.log(`${alerts.success} Svgs from ${alerts.path(input)} optimized to ${alerts.path(output)}`);
    }

    input = './dist/svg/*.svg';
    output = './dist/icons.svg';

    shell.exec(`npx svgstore -o ${output} ${input} --inline`, (code, stdout, stderr) => {
      if (code) {
        console.log(`${alerts.error} "svgs" failed: ${stderr}`);
        process.exit(1);
      } else {
        console.log(`${alerts.success} Created ${alerts.path(output)} sprite from ${alerts.path(input)}`);
      }
    });
  });
}