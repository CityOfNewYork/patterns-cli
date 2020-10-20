/**
 * Dependencies
 */

const args = require(`${__dirname}/args`).args;
const resolve = require(`${__dirname}/resolve`);

const alerts = resolve('config/alerts');

/**
 * Messages that cannot be disabled
 * @param  {String}  message  The message to log
 */
const always = (message) => {
  console.log(message);
};

/**
 * Messages that can be disabled by the no notifications argument
 * @param  {String}  message  The message to log
 */
const notify = (message) => {
  if (args.notify) console.log(message);
};

/**
 * Highly descriptive messages that can be disabled by the nondescript argument
 * @param  {String}  message  The message to log
 */
const describe = (message) => {
  if (args.notify && args.nondescript === false) console.log(message);
};

module.exports = {
  describe: describe,
  notify: notify,
  /**
   * Linting messages always need to display
   */
  lint: message => {
    always(message);
  },
  /**
   * When a file or group of files are being watched
   */
  watching: message => {
    notify(`${alerts.watching} ${message}`);
  },
  /**
   * When a command has successfully run
   */
  success: message => {
    notify(`${alerts.success} ${message}`);
  },
  /**
   * When there is an error in the process
   */
  error: message => {
    always(`${alerts.error} ${message}`);
  }
};