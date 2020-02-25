#!/usr/bin/env node

/**
 * Dependencies
 */

const Express = require('express');
const reload = require('reload');
const Path = require('path');
const alerts = require(`${process.env.PWD}/config/alerts`);
const nodemon = require('nodemon');
const http = require('http');

/**
 * Constants
 */

const args = process.argv.slice(2);
const PORT = process.env.PORT || '7000';
const DIST = Path.join(process.env.PWD, 'dist');

/**
 * Init
 */

let APP = new Express();
APP.set('port', PORT); // set the port

/**
 * Request handler
 */
APP.get('/*', (request, resolve, next) => {
  let req = request.params[0];

  // Allow the reload script to pass
  if (req === 'reload/reload.js') {
    next();
  } else {
    let page = (req === '') ? 'index.html' :
      (req.includes('.')) ? req : `${req}.html`;
    resolve.sendFile(`${DIST}/${page}`);
  }
});

let server = http.createServer(APP);

/**
 * Use nodemon + reload to reload the server
 */

if (args.includes('-w') || args.includes('--watch')) {
  nodemon(`-e html --watch ${process.env.PWD}/dist -x ${__dirname}/serve.js`);

  console.log(`${alerts.watching} Serve watching ${alerts.ext('.html')} in ${alerts.path('./dist/')}`);
} else {
  reload(APP, {port: JSON.parse(PORT) + 1}).then(() => {
    // Set the port to listen on
    server.listen(APP.get('port'), () => {
      let port = APP.get('port');
      console.log(`${alerts.info} Serving ${alerts.path('./dist/')} to ${alerts.url('http://localhost:' + port)}`);
    });
  }).catch(function (err) {
    console.error(`${alerts.error} Reload could not start`, err)
  })
}