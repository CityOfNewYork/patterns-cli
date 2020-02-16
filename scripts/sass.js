#!/usr/bin/env node

/**
 * Dependencies
 */
const Sass = (process.env.SASS = 'libSass') ? require('node-sass') : require('sass');
const Path = require('path');
const Fs = require('fs');
const mkdirp = require('mkdirp');
const modules = require(`${process.env.PWD}/config/sass`);
const alerts = require(`${process.env.PWD}/config/alerts`);

/**
 * Init
 */

function write(module) {
  let outDir = Path.join(process.env.PWD, module.outDir);
  let name = module.outFile;

  Sass.render(module, (err, result) => {
    if (err) {
      console.log(`${alerts.error} ${err.formatted}`);
    } else {
      Fs.writeFile(`${outDir}${name}`, result.css, (err) => {
        if (err) {
          console.log(`${alerts.error} ${err}`);
        } else {
          console.log(`${alerts.styles} Sass compiled to ${alerts.path(module.outDir + name)}`);
        }
      });
    }
  });
}

function run(module) {
  let outDir = Path.join(process.env.PWD, module.outDir);

  if (!Fs.existsSync(outDir)) {
    mkdirp(outDir, (err) => {
      if (err) {
        console.error(`${alerts.error} ${err}`);
      } else {
        write(module);
      }
    });
  } else {
    write(module);
  }
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
