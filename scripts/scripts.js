const shell = require('shelljs');
const args = process.argv.slice(2);
const alerts = require(`${process.env.PWD}/config/alerts`);

const config = './config/rollup.js';

shell.config.silent = true;

const cb = (code, stdout, stderr) => {
  if (code) {
    console.log(`${alerts.error} "scripts" failed: ${stderr}`);
    process.exit(1);
  } else {
    console.log(`${alerts.rollup} Rolled up modules defined in ${alerts.path(config)}`);
  }
};

if (args.includes('-w') || args.includes('--watch')) {
  shell.exec(`npx -q rollup -c ${config} -w`, cb);
  console.log(`${alerts.watching} Scripts watching ${alerts.ext('.js')} defined in ${alerts.path(config)}`);
} else {
  shell.exec(`npx -q rollup -c ${config}`, cb);
}