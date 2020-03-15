/**
 * Dependencies
 */

const alerts = require(`${process.env.PWD}/config/alerts`);
const args = require(`${__dirname}/args`).args;

/**
 *
 */

const always = (message) => {
  console.log(message);
};

const notify = (message) => {
  if (args.notify) console.log(message);
};

const describe = (message) => {
  if (args.notify && args.nondescript === false) console.log(message);
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