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
const VIEWS = Path.join(process.env.PWD, 'src/views');
const ENGINE = 'slm';
const LOCALS = require('./locals');

/**
 * Init
 */

let APP = new Express();

// APP.set('views', VIEWS); // set the views directory
// APP.set('view engine', ENGINE); // set the template engine
APP.set('port', PORT); // set the port

/** Mount the static file directory */
// APP.use(Express.static(DIST));

/**
 * Request handler
 */
APP.get('/*', (request, resolve, next) => {
  let req = request.params[0];

  // Allow the reload script to pass
  if (req === 'reload/reload.js') {
    next();
  } else {
    // resolve.render(req, LOCALS);
    let page = (req === '') ? 'index.html' : req;
    resolve.sendFile(`${DIST}/${page}`);
  }
});

let server = http.createServer(APP);

/**
 * Use nodemon + reload to reload the server
 */

if (args.includes('-w') || args.includes('--watch')) {
  nodemon(`-e html --watch ${process.env.PWD}/dist -x "node ${__dirname}/serve.js"`);

  console.log(`${alerts.watching} Serve watching ${alerts.ext('.slm')} and ${alerts.ext('.md')} in ${alerts.path('./src')}`);
} else {
  reload(APP, {port: JSON.parse(PORT) + 1}).then(() => {
    // Set the port to listen on
    server.listen(APP.get('port'), () => {
      let port = APP.get('port');
      console.log(`${alerts.info} Serving ${alerts.path('./src/views')} to ${alerts.url('http://localhost:' + port)}`);
    });
  }).catch(function (err) {
    console.error(`${alerts.error} Reload could not start`, err)
  })
}