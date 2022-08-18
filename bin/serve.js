#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const path = require('path');
const http = require('http');
const Express = require('express');
const reload = require('reload');
const chokidar = require('chokidar');

const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);

const alerts = resolve('config/alerts');
const global = resolve('config/global');

/**
 * Constants
 */

const PORT = process.env.PORT || '7000';
const DIST = path.join(global.base, global.dist);
const GLOBS = [
  `${DIST}/**/*.html`,
  `${DIST}/**/*.css`,
  `${DIST}/**/*.js`
];

/**
 * Our Chokidar Watcher
 *
 * @type {Source} https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(GLOBS, global.chokidar);

/**
 * The Express App
 *
 * @type {Source} https://expressjs.com/
 */
let APP = new Express();

APP.set('port', PORT); // set the port

/**
 * Application request handler
 */
APP.get('/*', (request, resolve, next) => {
  let req = request.params[0];

  // Allow the reload script to pass
  if (req === 'reload/reload.js') {
    next();
  } else {
    // If it is a sub-directory request, use the directory's index.html
    req = (req.substr(-1) === '/') ? `${req}index.html` : req;

    // if the req is blank, use the index file, if it does not have an extension request append .html
    let page = (req === '') ? 'index.html' : (req.includes('.')) ? req : `${req}.html`;

    resolve.sendFile(`${DIST}/${page}`);
  }
});

/**
 * Create the http server
 */
let server = http.createServer(APP);

/**
 * Main script, turns the server on to listen to the app
 *
 * @param  {Object}  app  The express app
 */
const main = async (app = APP) => {
  // Set the port to listen on
  server.listen(app.get('port'), () => {
    let port = app.get('port');

    cnsl.notify(`${alerts.info} Serving ${alerts.str.path(DIST)} to ${alerts.str.url('http://localhost:' + port)}`);
  });
};

/**
 * Runner for the serve script
 *
 * @param  {Object}  app  The express app
 */
const run = async (app = APP) => {
  if (args.watch) {
    try {
      let reloadReturned = await reload(app);

      main();

      watcher.on('change', () => {
        reloadReturned.reload();

        cnsl.watching(`Serve reloading`);
      });

      cnsl.watching(`Serve watching ${alerts.str.ext(GLOBS.join(', '))}`);
    } catch (err) {
      cnsl.error(`Serve (run): ${err}`);
    }
  } else {
    main()
  }
};

/**
 * Export our methods
 *
 * @type {Object}
 */
module.exports = {
  main: main,
  run: run
};
