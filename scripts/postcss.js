#!/usr/bin/env node

/**
 * Dependencies
 */

const Fs = require('fs');
const Path = require('path');
const Postcss = require('postcss');
const alerts = require(`${process.env.PWD}/config/alerts`);
const config = require(`${process.env.PWD}/config/postcss`);
const modules = require(`${process.env.PWD}/config/sass`);

/**
 * Init
 */
function run(module) {
  let bundle = Path.join(process.env.PWD, module.outDir, module.outFile);

  Fs.readFile(bundle, (err, css) => {
    Postcss(config.plugins)
      .process(css, {
        from: bundle,
        to: bundle
      })
      .then(result => {
        Fs.writeFile(bundle, result.css, (err) => {
          if (err) {
            console.log(`${alerts.error} ${err}`);
          } else {
            console.log(`${alerts.styles} PostCss processed ${alerts.path(module.outDir + module.outFile)}`);
          }
        });
      });
  });
}

if (process.env.NODE_ENV === 'development') {
  modules.forEach(function(module) {
    if (module.devModule) {
      run(module);
    }
  });
} else {
  modules.forEach(run);
}
