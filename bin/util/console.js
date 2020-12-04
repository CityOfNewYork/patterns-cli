/**
 * Dependencies
 */

const path = require('path');
const package = require(path.join(__dirname, '../../', 'package.json'));
const args = require(`${__dirname}/args`).args;
const resolve = require(`${__dirname}/resolve`);

const alerts = resolve('config/alerts');

const PWD = '.';
const PKG = '@pttrn';

/**
 *
 */

const replace = (str) => {
  let pwd = new RegExp(process.env.PWD, 'g');
  let file = new RegExp('file://', 'g');
  let pkg = new RegExp(`./node_modules/${package.name}`, 'g');

  return str
    .replace(file, '')
    .replace(pwd, PWD)
    .replace(pkg, PKG);
};

const always = (message) => {
  console.log(replace(message));
};

const notify = (message) => {
  if (args.notify)
    console.log(replace(message));
};

const describe = (message) => {
  if (args.notify && args.nondescript === false)
    console.log(replace(message));
};

module.exports = {
  describe: describe,
  notify: notify,
  lint: message => {
    always(message);
  },
  watching: message => {
    notify(`${alerts.watching} ${message}`);
  },
  success: message => {
    notify(`${alerts.success} ${message}`);
  },
  error: message => {
    always(`${alerts.error} ${message}`);
  }
};