/**
 * Dependencies
 */

const Express = require('express');
const Path = require('path');

/**
 * Constants
 */

const APP = new Express();
const PORT = process.env.PORT;
const DIST = Path.join(__dirname, '../', 'dist');
const VIEWS = Path.join(__dirname, '../', 'src/views');
const ENGINE = 'slm';
const LOCALS = require('./locals');

/**
 * Functions
 */

/**
 * The getter function for rendering views
 * @param  {object} request - the Express.get() request
 * @param  {function} resolve - the callback function
 */
function fnGet(request, resolve) {
  resolve.render(request.params[0], LOCALS);
}

/**
 * The callback function to signal the app is running
 */
function fnListenCallback() {
  let p = APP.get('port');
  console.log(`Listening on port ${p}!`);
}

/**
 * Init
 */

APP.set('views', VIEWS); // set the views directory
APP.set('view engine', ENGINE); // set the template engine
APP.set('port', PORT); // set the port
APP.use(Express.static(DIST)); // choose the static file directory
APP.get('/*', fnGet); // request handler
APP.listen(APP.get('port'), fnListenCallback); // set the port to listen on
